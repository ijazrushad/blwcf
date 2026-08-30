/**
 * All site content, bilingual.
 *
 * Intrinsic image dimensions are recorded here because the archival scans are
 * low resolution and have wildly different aspect ratios (0.38 to 1.58). The
 * gallery uses these to lay documents out at their true shape and to avoid
 * upscaling a 231px-wide scan into a blurry mess.
 */

export const locales = ['en', 'bn'] as const;
export type Locale = (typeof locales)[number];

/**
 * The public origin, used for canonical URLs, hreflang, the sitemap and the
 * social card.
 *
 * This has to match the domain the site is actually served from. A canonical
 * pointing at a hostname that does not answer tells search engines to index
 * nothing. Set NEXT_PUBLIC_SITE_URL in the Vercel project if the live domain
 * is ever anything other than the default below.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blwcf.org'
).replace(/\/$/, '');

/** The locale served at `/`, and the hreflang x-default target. */
export const defaultLocale: Locale = 'en';

export type Bi = { en: string; bn: string };

export type ArchiveItem = {
  id: string;
  src: string;
  /** True pixel size of the scan. The gallery and the reel lay out from these,
   *  so a wrong number shows up as a crop or a layout shift. */
  width: number;
  height: number;
  title: Bi;
  meta: Bi;
};

export const nav: { href: string; label: Bi }[] = [
  { href: '#archive', label: { en: 'Archive', bn: 'সংগ্রহশালা' } },
  { href: '#courses', label: { en: 'Courses', bn: 'ওয়ার কোর্স' } },
];

export const brand = {
  short: { en: 'BLWCF', bn: 'বিএলডব্লিউসিএফ' },
  full: {
    en: 'Bangladesh Liberation War Courses Foundation',
    bn: 'বাংলাদেশ লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন',
  },
  tagline: {
    en: 'Liberation War Courses Foundation',
    bn: 'লিবারেশন ওয়ার কোর্সেস ফাউন্ডেশন',
  },
  motto: {
    en: 'We answered the call to liberate our motherland',
    bn: 'মাতৃভূমিকে মুক্ত করার ডাকে আমরা সাড়া দিয়েছিলাম',
  },
};

export const hero = {
  /** Permanent Bengali art layer — never translated away. */
  watermark: 'মুক্তি',
  masked: { en: 'Liberation', bn: 'মুক্তিযুদ্ধ' },
  titleBefore: { en: 'Those Magnificent', bn: 'একাত্তরের সেই' },
  titleNumber: { en: '61', bn: '৬১' },
  titleAfter: { en: 'of Seventy-One', bn: 'বীর' },
  lead: {
    en: 'Sixty-one guerrilla cadets, pulled out of the fighting and marched north into the Dooars hill jungle. No band. No march past. Khaki, jungle boots, and a parchment commission.',
    bn: 'যুদ্ধক্ষেত্র থেকে বেছে নেওয়া ৬১ জন গেরিলা মুক্তিযোদ্ধা ক্যাডেট, উত্তরের ডুয়ার্সের পাহাড়ি জঙ্গলে পাঠানো হয়েছিল। কোনো ব্যান্ড ছিল না, কুচকাওয়াজ ছিল না। শুধু খাকি পোশাক, জঙ্গল বুট আর একটি সনদপত্র।',
  },
  meta: [
    {
      k: { en: 'Murti', bn: 'মুর্তি' },
      v: { en: 'Jalpaiguri, West Bengal', bn: 'জলপাইগুড়ি, পশ্চিমবঙ্গ' },
    },
    {
      k: { en: '09.10.1971', bn: '৯ অক্টোবর ১৯৭১' },
      v: { en: 'Commissioning', bn: 'কমিশন লাভ' },
    },
    {
      k: { en: '12 weeks', bn: '১২ সপ্তাহ' },
      v: { en: 'Provisional academy', bn: 'অস্থায়ী সামরিক একাডেমি' },
    },
  ],
  plate: {
    label: { en: 'Plate 01 — 9 October 1971', bn: 'চিত্র ০১ — ৯ অক্টোবর ১৯৭১' },
    body: {
      en: 'Acting President Syed Nazrul Islam inspects the guard of honour of the first batch of newly commissioned officers of the Mukti Bahini.',
      bn: 'অস্থায়ী রাষ্ট্রপতি সৈয়দ নজরুল ইসলাম মুক্তিবাহিনীর সদ্য কমিশনপ্রাপ্ত প্রথম দলের গার্ড অব অনার পরিদর্শন করছেন।',
    },
    place: { en: 'Murti, Jalpaiguri', bn: 'মুর্তি, জলপাইগুড়ি' },
  },
};

export const dates: { d: Bi; n: Bi }[] = [
  {
    d: { en: '26 March', bn: '২৬ মার্চ' },
    n: { en: 'Independence Day', bn: 'স্বাধীনতা দিবস' },
  },
  {
    d: { en: '05 August', bn: '৫ আগস্ট' },
    n: { en: 'Fellowship Day', bn: 'ফেলোশিপ দিবস' },
  },
  {
    d: { en: '09 October', bn: '৯ অক্টোবর' },
    n: { en: 'Foundation Day', bn: 'প্রতিষ্ঠা দিবস' },
  },
  {
    d: { en: '16 December', bn: '১৬ ডিসেম্বর' },
    n: { en: 'Victory Day', bn: 'বিজয় দিবস' },
  },
];

export const figures = {
  a: {
    n: { en: '61', bn: '৬১' },
    l: { en: 'Cadets commissioned 1971', bn: 'ক্যাডেট · কমিশন ১৯৭১' },
  },
  b: {
    n: { en: '46', bn: '৪৬' },
    l: { en: 'Cadets commissioned 1972', bn: 'ক্যাডেট · কমিশন ১৯৭২' },
  },
  c: {
    n: { en: '28', bn: '২৮' },
    l: { en: 'Gallantry awards', bn: 'বীরত্বসূচক খেতাব' },
  },
  text: {
    en: 'Originally named Short Service 1, renamed the 1st Bangladesh War Course after 1975. The course produced three martyrs, one Bir Uttom, two Bir Bikrams and seventeen Bir Protiks — and later four Major Generals, two Ambassadors and six PhDs.',
    bn: 'প্রথমে এই কোর্সের নাম ছিল শর্ট সার্ভিস ১, ১৯৭৫ সালের পর নাম হয় ১ম বাংলাদেশ ওয়ার কোর্স। এই কোর্স থেকে তিনজন শহীদ, একজন বীর উত্তম, দুইজন বীর বিক্রম ও সতেরোজন বীর প্রতীক — এবং পরবর্তীতে চারজন মেজর জেনারেল, দুইজন রাষ্ট্রদূত ও ছয়জন পিএইচডি ডিগ্রিধারী।',
  },
};

export type Course = {
  year: Bi;
  title: Bi;
  when: Bi;
  body: Bi;
  hand: Bi;
  image: { src: string; width: number; height: number };
  medals: { n: Bi; l: Bi }[];
};

export const courses: Course[] = [
  {
    year: { en: '1971', bn: '১৯৭১' },
    title: { en: '1st Bangladesh War Course', bn: '১ম বাংলাদেশ ওয়ার কোর্স' },
    when: {
      en: 'Commissioned 09 October · Murti',
      bn: 'কমিশন ৯ অক্টোবর · মুর্তি',
    },
    body: {
      en: 'The first batch of sixty-one officer cadets was selected from the battlefield and trained by Indian Army officers at an ad-hoc academy in Jalpaiguri district.',
      bn: 'যুদ্ধক্ষেত্র থেকে নির্বাচিত ৬১ জন অফিসার ক্যাডেটের প্রথম দলটি জলপাইগুড়ি জেলার একটি অস্থায়ী একাডেমিতে ভারতীয় সেনা অফিসারদের কাছে প্রশিক্ষণ নেয়।',
    },
    hand: {
      en: "2/Lt Saeed Ahmed received the C-in-C's Cane",
      bn: "সি-ইন-সি'স কেন পান ২/লেঃ সাঈদ আহমেদ",
    },
    image: { src: '/archive/course-1st.jpg', width: 720, height: 512 },
    medals: [
      { n: { en: '1', bn: '১' }, l: { en: 'Bir Uttom', bn: 'বীর উত্তম' } },
      { n: { en: '2', bn: '২' }, l: { en: 'Bir Bikram', bn: 'বীর বিক্রম' } },
      { n: { en: '17', bn: '১৭' }, l: { en: 'Bir Protik', bn: 'বীর প্রতীক' } },
      { n: { en: '3', bn: '৩' }, l: { en: 'Martyrs', bn: 'শহীদ' } },
    ],
  },
  {
    year: { en: '1972', bn: '১৯৭২' },
    title: { en: '2nd Bangladesh War Course', bn: '২য় বাংলাদেশ ওয়ার কোর্স' },
    when: {
      en: 'Commissioned 05 August · Dhaka Cantonment',
      bn: 'কমিশন ৫ আগস্ট · ঢাকা সেনানিবাস',
    },
    body: {
      en: 'Seventy cadets began at Murti in November 1971. Victory came before the twelve weeks ended. Forty-six passed out under President Justice Abu Sayeed Chowdhury.',
      bn: '১৯৭১ সালের নভেম্বরে মুর্তিতে ৭০ জন ক্যাডেটের প্রশিক্ষণ শুরু হয়। বারো সপ্তাহ শেষের আগেই বিজয় আসে। রাষ্ট্রপতি বিচারপতি আবু সাঈদ চৌধুরীর উপস্থিতিতে ৪৬ জন কমিশন লাভ করেন।',
    },
    hand: {
      en: 'Sword of Honour — BSUO Modasser Hossain Khan BP',
      bn: 'সোর্ড অব অনার — বিএসইউও মোদাচ্ছের হোসেন খান বীর প্রতীক',
    },
    image: { src: '/archive/course-2nd.jpg', width: 1290, height: 1219 },
    medals: [
      { n: { en: '3', bn: '৩' }, l: { en: 'Bir Bikram', bn: 'বীর বিক্রম' } },
      { n: { en: '5', bn: '৫' }, l: { en: 'Bir Protik', bn: 'বীর প্রতীক' } },
      {
        n: { en: '46', bn: '৪৬' },
        l: { en: 'Passed out', bn: 'কমিশনপ্রাপ্ত' },
      },
    ],
  },
];

export const archive: ArchiveItem[] = [
  {
    id: 'joy-bangla',
    src: '/archive/joy-bangla.jpg',
    width: 669,
    height: 532,
    title: { en: 'জয় বাংলা — the weekly', bn: 'সাপ্তাহিক জয় বাংলা' },
    meta: {
      en: '15 October 1971 · Mujibnagar',
      bn: '১৫ অক্টোবর ১৯৭১ · মুজিবনগর',
    },
  },
  {
    id: 'guard-of-honour',
    src: '/archive/guard-of-honour.jpg',
    width: 651,
    height: 471,
    title: { en: 'The guard of honour', bn: 'গার্ড অব অনার' },
    meta: { en: 'Syed Nazrul Islam · Murti', bn: 'সৈয়দ নজরুল ইসলাম · মুর্তি' },
  },
  {
    id: 'cadet-portrait',
    src: '/archive/cadet-portrait.jpg',
    width: 231,
    height: 605,
    title: { en: 'Cadet portrait', bn: 'ক্যাডেটের প্রতিকৃতি' },
    meta: { en: 'Murti camp · 1971', bn: 'মুর্তি ক্যাম্প · ১৯৭১' },
  },
  {
    id: 'photo-report',
    src: '/archive/photo-report.jpg',
    width: 603,
    height: 598,
    title: {
      en: 'Passing-out photo report',
      bn: 'কমিশন কুচকাওয়াজের ছবি প্রতিবেদন',
    },
    meta: { en: 'Four frames · Mukti Bahini', bn: 'চারটি ছবি · মুক্তিবাহিনী' },
  },
  {
    id: 'commission',
    src: '/archive/commission.jpg',
    width: 540,
    height: 400,
    title: { en: 'The parchment commission', bn: 'সনদপত্র হস্তান্তর' },
    meta: {
      en: 'Handed over by the Acting President',
      bn: 'অস্থায়ী রাষ্ট্রপতির হাত থেকে',
    },
  },
  {
    id: 'joy-bangla-press',
    src: '/archive/joy-bangla-press.jpg',
    width: 720,
    height: 482,
    title: { en: 'চিত্র পরিচিতি', bn: 'চিত্র পরিচিতি' },
    meta: {
      en: 'Joy Bangla Press · Mujibnagar',
      bn: 'জয় বাংলা প্রেস · মুজিবনগর',
    },
  },
  {
    id: 'murti-map',
    src: '/archive/murti-map.jpg',
    width: 720,
    height: 1012,
    title: { en: 'Murti, in the hill jungle', bn: 'মুর্তি, পাহাড়ি জঙ্গলে' },
    meta: {
      en: 'North of Siliguri · Bhutan border',
      bn: 'শিলিগুড়ির উত্তরে · ভুটান সীমান্ত',
    },
  },
  {
    id: 'parade',
    src: '/archive/parade.jpg',
    width: 526,
    height: 332,
    title: { en: 'Parade formation', bn: 'কুচকাওয়াজ' },
    meta: { en: 'Guard of honour', bn: 'গার্ড অব অনার' },
  },
  {
    id: 'salute',
    src: '/archive/salute.jpg',
    width: 548,
    height: 420,
    title: { en: 'The salute', bn: 'অভিবাদন' },
    meta: { en: 'Ceremony · 1971', bn: 'অনুষ্ঠান · ১৯৭১' },
  },
  {
    id: 'course-1st',
    src: '/archive/course-1st.jpg',
    width: 720,
    height: 512,
    title: { en: '1st Bangladesh War Course', bn: '১ম বাংলাদেশ ওয়ার কোর্স' },
    meta: {
      en: '9 October 1971 · with name key',
      bn: '৯ অক্টোবর ১৯৭১ · নামসহ',
    },
  },
  {
    id: 'course-2nd',
    src: '/archive/course-2nd.jpg',
    width: 1290,
    height: 1219,
    title: {
      en: 'Second Short Service Commission',
      bn: 'দ্বিতীয় শর্ট সার্ভিস কমিশন',
    },
    meta: { en: '5 August 1972 · with name key', bn: '৫ আগস্ট ১৯৭২ · নামসহ' },
  },
];

export const verse = {
  /** Never translated away — the Bengali stays in both languages. */
  lines: [
    '‘দিকে দিকে ওড়ে মুক্তি পতাকা,',
    'মুক্তি বাহিনী তোলে আওয়াজ,',
    'শহীদ হওয়ার দিন চলে গেছে',
    'সকলেই গাজী হবে যে আজ’',
  ],
  translation: {
    en: '“Everywhere the flag of freedom flies, the Mukti Bahini raises its voice — the day of martyrdom has passed, today all shall be victorious.”',
    bn: 'একাত্তরের মুক্তিযুদ্ধ চলাকালে লেখা পঙ্‌ক্তি।',
  },
  by: 'সিকান্দার আবু জাফর',
};

/**
 * A section heading, split in two so the second half can be set in italic.
 *
 * How the halves join differs by language, which is why it is spelled out
 * rather than left to a space in the string: English "The archive" takes a
 * space, the Bengali "সংগ্রহশালা" is one word and takes none.
 */
export type SectionTitle = {
  lead: Bi;
  italic: Bi;
  /** Languages where the two halves run together with no space between. */
  tight?: { en: boolean; bn: boolean };
  /** True where the italic half starts a new line instead. */
  stacked?: boolean;
};

export const sections: Record<
  'archive' | 'courses',
  { n: string; kick: Bi; title: SectionTitle; mark: Bi }
> = {
  archive: {
    n: '01',
    kick: { en: 'glimpses', bn: 'কিছু মুহূর্ত' },
    title: {
      lead: { en: 'The', bn: 'সংগ্রহ' },
      italic: { en: 'archive', bn: 'শালা' },
      tight: { en: false, bn: true },
    },
    /* the mark shows the other language's wording, in both languages */
    mark: { en: 'সংগ্রহশালা', bn: 'The archive' },
  },
  courses: {
    n: '02',
    kick: { en: 'the record', bn: 'ইতিহাস' },
    title: {
      lead: { en: 'Two courses,', bn: 'দুইটি কোর্স,' },
      italic: { en: 'one beginning', bn: 'একটি সূচনা' },
      stacked: true,
    },
    mark: { en: 'দুইটি ওয়ার কোর্স', bn: 'Two war courses' },
  },
};

export const footer = {
  blurb: {
    en: 'Formed by the officers of the 1st and 2nd Bangladesh War Courses to preserve the record of 1971 and to keep fellowship among those who served.',
    bn: '১ম ও ২য় বাংলাদেশ ওয়ার কোর্সের অফিসারদের দ্বারা গঠিত, ১৯৭১ সালের ইতিহাস সংরক্ষণ ও পারস্পরিক সৌহার্দ্য রক্ষার উদ্দেশ্যে।',
  },
  cols: [
    {
      h: { en: 'Explore', bn: 'দেখুন' },
      links: [
        { href: '#archive', label: { en: 'Archive', bn: 'সংগ্রহশালা' } },
        { href: '#courses', label: { en: 'Courses', bn: 'ওয়ার কোর্স' } },
      ],
    },
    {
      h: { en: 'Dates', bn: 'দিবস' },
      links: [
        { href: '#dates', label: { en: '26 March', bn: '২৬ মার্চ' } },
        { href: '#dates', label: { en: '5 August', bn: '৫ আগস্ট' } },
        { href: '#dates', label: { en: '9 October', bn: '৯ অক্টোবর' } },
        { href: '#dates', label: { en: '16 December', bn: '১৬ ডিসেম্বর' } },
      ],
    },
    {
      h: { en: 'Contact', bn: 'যোগাযোগ' },
      links: [
        { href: '#', label: { en: 'Office Bearers', bn: 'কর্মকর্তাবৃন্দ' } },
        { href: '#', label: { en: 'Membership', bn: 'সদস্যপদ' } },
      ],
    },
  ],
};

export const ui = {
  switchTo: { en: 'বাংলা', bn: 'English' },
  close: { en: 'Close', bn: 'বন্ধ করুন' },
  prev: { en: 'Previous', bn: 'পূর্ববর্তী' },
  next: { en: 'Next', bn: 'পরবর্তী' },
  zoom: { en: 'Zoom', bn: 'জুম' },
};
