'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AboutPage: React.FC = () => {
  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b '>
      <div className='container flex flex-col gap-12 border-x h-full py-[80px] px-12'>
        {/* Hero Section */}
        <div className='flex flex-col gap-3'>
          <h1 className='text-4xl font-bold'>About Ticketez</h1>
          <p className='text-muted-foreground text-lg'>
            Effortless ticket booking for India's monuments and museums.
          </p>
        </div>

        {/* Our Mission */}
        <div className='border rounded-lg p-8 flex flex-col gap-4'>
          <h2 className='text-2xl font-semibold'>Our Mission</h2>
          <p className='text-muted-foreground leading-relaxed'>
            Ticketez was built to eliminate the friction of visiting India's incredible cultural
            heritage sites. No more standing in long queues, no confusing booking portals — just a
            clean, fast, and reliable ticket booking experience.
          </p>
        </div>

        {/* How It Works */}
        <div className='flex flex-col gap-6'>
          <h2 className='text-2xl font-semibold'>How It Works</h2>
          <div className='grid grid-cols-3 gap-6'>
            <div className='border rounded-lg p-6 flex flex-col gap-3'>
              <span className='text-3xl'>🔍</span>
              <h3 className='text-lg font-semibold'>Discover</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Browse hundreds of monuments and museums across India. Find places near you or
                explore by state and city.
              </p>
            </div>

            <div className='border rounded-lg p-6 flex flex-col gap-3'>
              <span className='text-3xl'>🎫</span>
              <h3 className='text-lg font-semibold'>Book</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Select your visit date, add your group members, and complete your booking in under 3
                clicks. Pay via UPI and submit your transaction ID.
              </p>
            </div>

            <div className='border rounded-lg p-6 flex flex-col gap-3'>
              <span className='text-3xl'>🏛️</span>
              <h3 className='text-lg font-semibold'>Visit</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Receive your confirmed e-ticket via email. Show the QR code at the entry gate and
                enjoy your visit hassle-free.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className='border rounded-lg p-6'>
          <div className='flex items-center justify-around'>
            <div className='flex flex-col items-center gap-1'>
              <span className='text-3xl font-bold'>9+</span>
              <span className='text-muted-foreground text-sm'>Places</span>
            </div>
            <div className='w-px h-12 bg-border' />
            <div className='flex flex-col items-center gap-1'>
              <span className='text-3xl font-bold'>5</span>
              <span className='text-muted-foreground text-sm'>Cities</span>
            </div>
            <div className='w-px h-12 bg-border' />
            <div className='flex flex-col items-center gap-1'>
              <span className='text-3xl font-bold'>1</span>
              <span className='text-muted-foreground text-sm'>State (and growing)</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='flex flex-col items-center gap-4 py-6'>
          <h2 className='text-2xl font-semibold'>Ready to explore India's heritage?</h2>
          <Button asChild size='lg'>
            <Link href='/'>Start Exploring</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
