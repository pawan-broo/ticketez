import '@/index.css';
import Providers from '@/components/providers';
import { satoshi } from '@/public/font';

export default function PrankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${satoshi.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
