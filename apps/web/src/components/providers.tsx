'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, trpc, trpcClient } from '@/utils/trpc';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';
import { useMounted } from '@/hooks';
import { useEffect, useState } from 'react';

import Lenis from 'lenis';

export default function Providers({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const [trpcClientState] = useState(() => trpcClient);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      allowNestedScroll: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  });

  if (!mounted) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClientState} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ReactQueryDevtools />
          <Toaster richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
