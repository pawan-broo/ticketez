import Link from 'next/link';
import React from 'react';
import { footerLinks } from './data';

const socialTitles = ['Social'];

export const Footer: React.FC = () => {
  return (
    <footer className='w-full bg-primary h-fit flex justify-center gap-8'>
      <div className='container relative overflow-hidden border-x w-full border-secondary/10'>
        <div className='p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-8'>
          <section>
            <p className='text-background/50 gap-2 cursor-default leading-none flex items-center'>
              <span className='mt-0.5'>[</span>
              <span>Reach Out</span>
              <span className='mt-0.5'>]</span>
            </p>
            <p className='text-2xl sm:text-3xl md:text-[40px] text-background font-flagfies'>
              hello@ticketez.com
            </p>
            <section className='mt-2 flex flex-wrap items-center gap-3 md:gap-5'>
              <p className='text-sm text-background/50'>&copy; 2025 Ticketez</p>
              <Link href={'/' as never} className='text-sm text-background/50'>
                Privacy Policy
              </Link>
              <Link href={'/' as never} className='text-sm text-background/50'>
                Terms and Conditions
              </Link>
              <Link href={'/' as never} className='text-sm text-background/50'>
                Refund and Return Policy
              </Link>
            </section>
          </section>

          <div className='flex flex-wrap gap-6 md:gap-8'>
            {footerLinks.map((footerLink, index) => {
              const isSocial = socialTitles.includes(footerLink.title);
              return (
                <section key={index}>
                  <p className='text-background/50 gap-2 cursor-default leading-none flex items-center'>
                    <span className='mt-0.5'>[</span>
                    <span>{footerLink.title}</span>
                    <span className='mt-0.5'>]</span>
                  </p>
                  <ul className='mt-5 text-background'>
                    {footerLink.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href as never}
                          {...(isSocial
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

        <p className='text-[400px] font-flagfies text-center select-none leading-none text-secondary/10 overflow-hidden h-[250px] whitespace-nowrap'>
          Ticketez
        </p>
      </div>
    </footer>
  );
};
