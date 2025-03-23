import { Metadata } from 'next';
import AuthLayoutClient from './AuthLayoutClient';

export const metadata: Metadata = {
  title: 'Authentication - Location Store',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
} 