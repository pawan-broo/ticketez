import type { Metadata } from 'next';
import '@/index.css';
import Providers from '@/components/providers';
import { satoshi } from '@/public/font';
import { AdminSidebar } from './_components/sidebar';

export const metadata: Metadata = {
  title: 'Ticketez Admin',
  description: 'Ticketez Admin Panel',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${satoshi.className} antialiased`}>
        <Providers>
          <div className='flex h-screen bg-background'>
            <AdminSidebar />
            <main className='flex-1 overflow-y-auto'>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
