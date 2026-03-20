'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [countdown, setCountdown] = useState(5);

  const isAdmin =
    session && (session.user as any).role === 'ADMIN';
  const isAccessDenied = !isPending && !isAdmin;

  useEffect(() => {
    if (isAccessDenied) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAccessDenied, router]);

  if (isPending) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-6 p-8'>
        <div className='w-full max-w-2xl space-y-4'>
          <Skeleton className='h-10 w-48 mx-auto' />
          <Skeleton className='h-6 w-72 mx-auto' />
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-[88px] rounded-lg' />
            ))}
          </div>
          <Skeleton className='h-64 w-full rounded-lg' />
        </div>
      </div>
    );
  }

  if (isAccessDenied) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center'>
        <span className='text-6xl select-none'>🚫</span>
        <h1 className='text-3xl font-bold'>Access Denied</h1>
        <p className='text-muted-foreground'>
          You don&apos;t have permission to access this page.
        </p>
        <p className='text-sm text-muted-foreground'>
          Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
        <Button onClick={() => router.push('/')}>Go Home Now</Button>
      </div>
    );
  }

  return <>{children}</>;
}
