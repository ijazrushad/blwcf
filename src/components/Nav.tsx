import Image from 'next/image';
import Link from 'next/link';
import { brand, nav, ui, type Locale } from '@/content/site';
import s from './Nav.module.css';

export default function Nav({ locale }: { locale: Locale }) {
  const other: Locale = locale === 'en' ? 'bn' : 'en';

  return (
    <nav className={s.nav}>
      <div className={`wrap ${s.inner}`}>
        <Link href={`/${locale}`} className={s.brand}>
          <Image src="/logo.png" alt="" width={500} height={500} priority />
          <span>
            <span className={s.bt}>{brand.short[locale]}</span>
            <span className={s.sub}>{brand.tagline[locale]}</span>
          </span>
        </Link>

        {nav.map((item) => (
          <a key={item.href} href={item.href} className={s.link}>
            {item.label[locale]}
          </a>
        ))}

        <Link href={`/${other}`} className={s.langbtn} hrefLang={other}>
          {ui.switchTo[locale]}
        </Link>
      </div>
    </nav>
  );
}
