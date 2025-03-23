import { Suspense } from 'react';
import HomeClient from './_components/client/HomeClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}
