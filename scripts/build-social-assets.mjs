/**
 * Build the Open Graph card and favicons from the archival plate + seal.
 * Run: node scripts/build-social-assets.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const appDir = path.join(root, 'src', 'app');

const W = 1200;
const H = 630;

const photo = path.join(pub, 'archive', 'guard-of-honour.jpg');
const logo = path.join(pub, 'blwcf-logo-2026.png');

/* bone paper + red — matches the site tokens */
const bg = '#efe9dc';
const red = '#c8102e';

async function socialCard() {
  const plate = await sharp(photo)
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.15 })
    .linear(1.12, -8)
    .jpeg({ quality: 92 })
    .toBuffer();

  const seal = await sharp(logo)
    .resize(96, 96, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0906" stop-opacity="0.25"/>
      <stop offset="45%" stop-color="#0a0906" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0a0906" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="48" y="48" width="8" height="72" fill="${red}"/>
  <text x="72" y="78" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="4" fill="${bg}" opacity="0.92">BLWCF</text>
  <text x="72" y="108" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="1.5" fill="${bg}" opacity="0.7">Liberation War Courses Foundation</text>
  <text x="72" y="470" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-style="italic" fill="${bg}">Those Magnificent 61</text>
  <text x="72" y="536" font-family="Georgia, 'Times New Roman', serif" font-size="54" fill="${bg}">of Seventy-One</text>
  <text x="72" y="586" font-family="ui-monospace, Consolas, monospace" font-size="16" letter-spacing="2" fill="${bg}" opacity="0.75">MURTI · 9 OCTOBER 1971 · JALPAIGURI</text>
</svg>`);

  await sharp(plate)
    .composite([
      { input: overlay, top: 0, left: 0 },
      { input: seal, top: H - 48 - 96, left: W - 48 - 96 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(pub, 'social-card.jpg'));

  console.log('wrote public/social-card.jpg');
}

async function icons() {
  const sizes = [
    { file: path.join(appDir, 'icon.png'), size: 32 },
    { file: path.join(appDir, 'apple-icon.png'), size: 180 },
    { file: path.join(pub, 'apple-icon.png'), size: 180 },
    { file: path.join(pub, 'icon-512.png'), size: 512 },
  ];

  for (const { file, size } of sizes) {
    await sharp(logo)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 239, g: 233, b: 220, alpha: 1 },
      })
      .flatten({ background: bg })
      .png()
      .toFile(file);
    console.log('wrote', path.relative(root, file));
  }

  /* 32×32 ico for older scrapers that still ask for /favicon.ico */
  const icoPng = await sharp(logo)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 239, g: 233, b: 220, alpha: 1 },
    })
    .flatten({ background: bg })
    .png()
    .toBuffer();
  await writeFile(path.join(pub, 'favicon.ico'), icoPng);
  console.log('wrote public/favicon.ico (png bytes; fine for modern browsers)');
}

await mkdir(appDir, { recursive: true });
await socialCard();
await icons();
