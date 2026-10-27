#!/usr/bin/env node
// Fails when tracked files look like they carry an injected loader.
//
// In September 2026 this repository was force-pushed with forged commits that
// hid an obfuscated payload after hundreds of tabs on the last line of
// eslint.config.mjs, and prefixed dev/build/start with `node api.js`. This
// script looks for exactly those tricks, and a few close relatives, so the
// next attempt fails CI instead of reaching a laptop. No dependencies: it must
// be safe to run before `npm ci`.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SOURCE = /\.(?:[cm]?[jt]sx?|json)$/;
const CONFIG =
  /(?:^|\/)(?:eslint|next|postcss|tailwind|prettier|vite|babel|webpack)\.config\.[cm]?[jt]s$/;

// Only these may be run with `node` from package.json scripts.
const ALLOWED_NODE_SCRIPTS = new Set([
  'scripts/build-social-assets.mjs',
  'scripts/check-integrity.mjs',
]);
// Scripts npm runs implicitly, or that a developer runs without thinking.
const IMPLICIT = /^(?:pre|post)|^(?:install|prepare|dev|build|start)$/;

const RULES = [
  {
    re: /[\t ]{200,}\S/,
    why: '200+ whitespace characters before code (content hidden off-screen)',
  },
  {
    re: /global\s*\[\s*['"]!['"]\s*\]\s*=/,
    why: "global['!'] marker of the 2026 loader campaign",
  },
  {
    re: /global\.i\s*=\s*['"]A?\d-\d{4}['"]/,
    why: 'global.i marker of the 2026 loader campaign',
  },
  {
    re: /(?:\\u00[0-7][0-9a-fA-F]){6,}/,
    why: 'long \\u00XX escape chain (obfuscated identifier)',
  },
  {
    re: /_0x[0-9a-f]{4,6}\s*\(\s*0x[0-9a-f]+\s*\)/,
    why: 'javascript-obfuscator string-table call',
  },
];
const CONFIG_RULES = [
  { re: /\bcreateRequire\b/, why: 'createRequire in a config file' },
  {
    re: /\b(?:eval|Function)\s*\(/,
    why: 'eval / Function constructor in a config file',
  },
  {
    re: /\bchild_process\b|\bhttps?\.(?:get|request)\b|\bfetch\s*\(/,
    why: 'network or process access in a config file',
  },
];
const MAX_LINE = 1000;

const problems = [];
const report = (file, line, why) =>
  problems.push(`${file}${line ? `:${line}` : ''}  ${why}`);

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

for (const file of files) {
  if (!SOURCE.test(file) && !CONFIG.test(file)) continue;
  if (file === 'scripts/check-integrity.mjs') continue; // it has to spell the patterns out
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const rules = CONFIG.test(file) ? [...RULES, ...CONFIG_RULES] : RULES;

  lines.forEach((line, i) => {
    for (const { re, why } of rules)
      if (re.test(line)) report(file, i + 1, why);
    if (line.length > MAX_LINE && file !== 'package-lock.json') {
      report(file, i + 1, `line is ${line.length} characters long`);
    }
  });
}

// package.json: nothing may run an unexpected file with node, and nothing npm
// runs implicitly may run node at all.
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const [name, cmd] of Object.entries(pkg.scripts ?? {})) {
  for (const [, target] of cmd.matchAll(/\bnode\s+(?:--\S+\s+)*([^\s&|;]+)/g)) {
    if (!ALLOWED_NODE_SCRIPTS.has(target))
      report('package.json', 0, `script "${name}" runs node ${target}`);
    else if (IMPLICIT.test(name))
      report(
        'package.json',
        0,
        `implicit script "${name}" runs node ${target}`
      );
  }
}

// package-lock.json: every package must come from the public registry.
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
for (const [name, entry] of Object.entries(lock.packages ?? {})) {
  if (
    entry.resolved &&
    !entry.resolved.startsWith('https://registry.npmjs.org/')
  ) {
    report(
      'package-lock.json',
      0,
      `${name || '(root)'} resolves to ${entry.resolved}`
    );
  }
}

if (problems.length) {
  console.error(`Integrity check failed (${problems.length}):\n`);
  for (const p of problems) {
    console.error(`  ${p}`);
    if (process.env.GITHUB_ACTIONS) console.log(`::error::${p}`);
  }
  process.exit(1);
}
console.log(`Integrity check passed (${files.length} tracked files).`);
