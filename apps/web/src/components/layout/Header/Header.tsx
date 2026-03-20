'use client';

import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';

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
import { ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { data, isRefetching, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/';
        },
      },
    });
  };
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
              <Link href={navLink.href as Route}>{navLink.label}</Link>
            </Button>
          ))}
        </nav>

        <section className='flex items-center gap-2'>
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
                    <DropdownMenuItem asChild>
                      <Link href='/' className='cursor-pointer'>
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
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
        </section>
      </div>
    </div>
  );
};
