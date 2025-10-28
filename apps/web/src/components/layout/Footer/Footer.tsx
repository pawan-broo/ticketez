import Link from 'next/link';
import React from 'react';
import { footerLinks } from './data';

export const Footer: React.FC = () => {
  return (
    <footer className='w-full  bg-primary  flex justify-center gap-8'>
      <div className='container relative overflow-hidden border-x w-full border-secondary/10'>
        <div className='p-12 flex justify-between '>
          <section>
            <p className='text-background/50 gap-2 cursor-default leading-none flex items-center'>
              <span className='mt-0.5'>[</span>
              <span>React Out</span>
              <span className='mt-0.5'>]</span>
            </p>
            <p className='text-[40px] text-background font-flagfies'>
              hello@titiesfy.com
            </p>
            <section className='mt-2 flex items-center gap-5'>
              <p className='text-sm text-background/50'>&copy; 2025 Titiesfy</p>
              <Link href='/' className='text-sm text-background/50'>
                Privacy Policy
              </Link>
              <Link href='/' className='text-sm text-background/50'>
                Terms and Conditions
              </Link>
              <Link href='/' className='text-sm text-background/50'>
                Refund and Return Policy
              </Link>
            </section>
          </section>

          <div className='flex gap-8'>
            {footerLinks.map((footerLink, index) => (
              <section key={index}>
                <p className='text-background/50 gap-2 cursor-default leading-none flex items-center'>
                  <span className='mt-0.5'>[</span>
                  <span>{footerLink.title}</span>
                  <span className='mt-0.5'>]</span>
                </p>
                <ul className='mt-5 text-background'>
                  {footerLink.links.map((link, index) => (
                    <li key={index}>
                      <Link href='/'>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <p className='text-[400px] font-flagfies text-center select-none leading-none text-secondary/10 overflow-hidden h-[250px]'>
          Ticketez
        </p>
      </div>
    </footer>
  );
};
