import React from 'react';
import { Button } from '@/components/ui/button';
import { navLinks } from './data';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <div className='bg-background fixed w-full h-[100px] top-0 z-50 flex justify-center border-b'>
      <div className='relative container flex justify-between border-x px-8 py-8'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='bg-primary size-7 rounded-full' />
          <h1 className='font-medium'>Ticketez</h1>
        </Link>

        <nav className='absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2'>
          {navLinks.map((navLink, index) => (
            <Button key={index} variant='ghost' asChild>
              <Link href='/'>{navLink.label}</Link>
            </Button>
          ))}
        </nav>

        <section className='flex items-center gap-2'>
          <Button size='sm' asChild>
            <Link href='/login'>Login</Link>
          </Button>
          {/* <Button size="sm"></Button> */}
        </section>
      </div>
    </div>
  );
};
