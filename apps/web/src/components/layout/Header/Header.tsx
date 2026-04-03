'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Menu, X } from 'lucide-react';

import { navLinks } from './data';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export const Header: React.FC = () => {
  const { data, isRefetching, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className='bg-background fixed w-full top-0 z-50 border-b'>
      {/* Main header bar */}
      <div className='flex justify-center'>
        <div className='relative container flex items-center justify-between border-x px-4 md:px-8 h-[70px] md:h-[100px]'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2' onClick={closeMobileMenu}>
            <div className='bg-primary size-7 rounded-full' />
            <h1 className='font-medium'>Ticketez</h1>
          </Link>

          {/* Desktop center nav — hidden on mobile */}
          <nav className='hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2'>
            {navLinks.map((navLink, index) => (
              <Button key={index} variant='ghost' asChild>
                <Link href={navLink.href as Route}>{navLink.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Right section: auth + hamburger */}
          <section className='flex items-center gap-2'>
            {/* Auth state */}
            {isRefetching || isPending ? (
              <Skeleton className='w-8 h-8 rounded-full' />
            ) : (
              <>
                {data?.session.id ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='relative h-8 w-8 rounded-full'
                      >
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={data.user.image || undefined}
                            alt={data.user.name || 'User'}
                          />
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56' align='end' forceMount>
                      <DropdownMenuItem asChild>
                        <Link href={'/profile' as Route} className='cursor-pointer'>
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/activity' className='cursor-pointer'>
                          <span>Activity</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href='/saved' className='cursor-pointer'>
                          <span>Saved Places</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={handleLogout}
                      >
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size='sm' asChild>
                    <Link href='/login'>Login</Link>
                  </Button>
                )}
              </>
            )}

            {/* Hamburger toggle — visible on mobile only */}
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden'
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          </section>
        </div>
      </div>

      {/* Mobile dropdown nav — slides in below the header bar */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-background border-t'>
          <div className='flex justify-center'>
            <nav className='container border-x px-4 py-3 flex flex-col'>
              {navLinks.map((navLink, index) => (
                <Button
                  key={index}
                  variant='ghost'
                  asChild
                  className='justify-start w-full'
                >
                  <Link
                    href={navLink.href as Route}
                    onClick={closeMobileMenu}
                  >
                    {navLink.label}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
