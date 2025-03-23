import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login - Location Store',
};

export default function LoginPage() {
  return <LoginClient />;
} 