'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { Route } from 'next';

const SKELETON_COUNT = 4;

export const PopularMonuments: React.FC = () => {
  const router = useRouter();

  const { data: monuments, isLoading } = trpc.places.getAll.useQuery(
    { type: 'monument', limit: 4 },
    { staleTime: 60000 },
  );

  const handleCardClick = (p: {
    slug: string;
    country: string;
    state: string;
    city: string;
  }) => {
    const url = `/search?country=${encodeURIComponent(p.country.toLowerCase())}&state=${encodeURIComponent(p.state.toLowerCase())}&city=${encodeURIComponent(p.city.toLowerCase())}&lookFor=${p.slug}&destinationType=monument`;
    router.push(url as Route);
  };

  const handleBrowseAll = () => {
    router.push('/places?type=monument' as Route);
  };

  return (
    <div className='flex w-full flex-col items-center justify-center border-b'>
      <div className='container bg-primary flex flex-col items-center gap-8 border-x h-full justify-center py-[80px] px-12'>
        <p className='text-secondary gap-2 hover:gap-5 duration-100 cursor-default leading-none flex items-center'>
          <span className='mt-0.5'>[</span>
          <span>Popular Monuments to Visit</span>
          <span className='mt-0.5'>]</span>
        </p>

        <div className='w-full grid grid-cols-4 gap-5'>
          {/* Loading skeletons */}
          {isLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className='w-full h-full bg-secondary/10 rounded-xl p-4 animate-pulse'
              >
                <div className='w-full h-[200px] bg-secondary/20 rounded-lg' />
                <div className='p-2 flex flex-col gap-2 mt-1'>
                  <div className='h-4 bg-secondary/20 rounded w-3/4' />
                  <div className='h-3 bg-secondary/20 rounded w-1/2' />
                  <div className='h-3 bg-secondary/20 rounded w-1/4' />
                </div>
              </div>
            ))}

          {/* Placeholder cards if no data */}
          {!isLoading &&
            (!monuments || monuments.length === 0) &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className='w-full h-full bg-secondary/10 rounded-xl p-4'
              >
                <div className='w-full h-[200px] bg-secondary/10 rounded-lg relative overflow-hidden' />
                <div className='p-2 leading-none'>
                  <p className='text-xl text-background'>Monument</p>
                  <p className='text-background/50'>Location</p>
                </div>
              </div>
            ))}

          {/* Real data */}
          {!isLoading &&
            monuments &&
            monuments.length > 0 &&
            monuments.map((p) => (
              <div
                key={p.id}
                onClick={() => handleCardClick(p)}
                className='w-full h-full bg-secondary/10 rounded-xl p-4 cursor-pointer hover:bg-secondary/20 transition-colors'
              >
                <div className='w-full h-[200px] bg-secondary/10 rounded-lg relative overflow-hidden' />
                <div className='p-2 leading-none'>
                  <p className='text-xl text-background'>{p.name}</p>
                  <p className='text-background/50'>
                    {p.city}, {p.state}
                  </p>
                  {p.ticketPrice > 0 && (
                    <p className='text-sm text-background/50 mt-1'>
                      ₹{p.ticketPrice / 100}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>

        <Button
          size='xl'
          variant='secondary'
          className='flex items-center pr-px'
          onClick={handleBrowseAll}
        >
          Browse all Monuments
          <div className='h-full aspect-square justify-center p-[6px] flex items-center'>
            <div className='bg-primary text-background w-full h-full flex justify-center items-center rounded-sm'>
              <ArrowUpRight />
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
