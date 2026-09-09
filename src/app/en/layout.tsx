import SiteDocument from '../_shared/document';
import { buildMetadata } from '../_shared/metadata';
import { fontVars } from '@/fonts/en';

export { viewport } from '../_shared/metadata';

export const metadata = buildMetadata('en');

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument locale="en" fontVars={fontVars}>
      {children}
    </SiteDocument>
  );
}
