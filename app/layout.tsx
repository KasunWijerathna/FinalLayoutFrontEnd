import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import ClientLayout from './_components/layout/ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Location Store',
  description: 'Manage your locations and devices efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
