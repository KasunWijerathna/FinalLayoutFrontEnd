'use client';

import ClientLayout from '@/app/_components/layout/ClientLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
} 