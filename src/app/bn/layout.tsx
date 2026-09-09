import SiteDocument from '../_shared/document';
import { buildMetadata } from '../_shared/metadata';
import { fontVars } from '@/fonts/bn';

export { viewport } from '../_shared/metadata';

export const metadata = buildMetadata('bn');

export default function BnLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteDocument locale="bn" fontVars={fontVars}>
      {children}
    </SiteDocument>
  );
}
