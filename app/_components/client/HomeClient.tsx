'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/_lib/store';
import Link from 'next/link';

export default function HomeClient() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Layout Index
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Your one-stop solution for managing and organizing layouts efficiently
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Easy Organization
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Organize your layouts with intuitive tools and categories
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Access
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Find and access your layouts instantly with powerful search
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Collaborative Tools
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Share and collaborate on layouts with your team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Join thousands of users who are already organizing their layouts efficiently.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 