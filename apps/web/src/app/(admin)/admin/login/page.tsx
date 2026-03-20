'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cubicBezier, motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { ShieldCheck } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueWithGoogle = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/admin/dashboard',
    });
  };

  return (
    <div className='flex h-full w-full flex-col items-center'>
      <div className='container flex flex-col items-center gap-8 h-full border-x p-8'>
        <div className='container relative overflow-hidden h-full border rounded-lg flex flex-col justify-center items-center gap-6 py-12'>
          {/* Animated grid background */}
          <div className='w-full h-full absolute top-0 left-0 grid grid-cols-20 grid-rows-10'>
            {Array.from({ length: 200 }).map((_, index) => (
              <motion.div
                key={index}
                whileHover={{
                  backgroundColor: 'oklch(0.4341 0.0392 41.9938 / 0.05)',
                  transition: { duration: 0.5 },
                }}
                transition={{
                  duration: 0.5,
                  ease: cubicBezier(0.7, 0.1, 0.01, 1),
                  delay: 0.5,
                }}
                className='w-full h-full border border-primary/1'
              />
            ))}
          </div>

          {/* Logo */}
          <div className='z-10 flex items-center gap-3'>
            <div className='size-[50px] rounded-full bg-primary flex items-center justify-center'>
              <ShieldCheck className='size-6 text-primary-foreground' />
            </div>
          </div>

          {/* Heading */}
          <section className='z-10 flex flex-col items-center leading-none gap-2'>
            <h1 className='text-[40px] font-medium text-primary'>
              Admin Portal
            </h1>
            <p className='text-sm text-muted-foreground'>
              Restricted access — administrators only
            </p>
          </section>

          {/* Google Sign In */}
          <Button
            className='w-[400px] z-10'
            size='xl'
            disabled={isLoading}
            onClick={handleContinueWithGoogle}
          >
            <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#fff'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#fff'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#fff'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#fff'
              />
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <p className='z-10 text-xs text-muted-foreground max-w-[400px] text-center'>
            Only authorised Google accounts with administrator privileges can
            access this panel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
