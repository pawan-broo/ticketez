'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { popularMuseums } from './data';

export const PopularMuseums: React.FC = () => {
  return (
    <div className='flex w-full  flex-col   items-center justify-center border-b'>
      <div className='container bg-primary flex flex-col  items-center gap-8 border-x h-full justify-center  py-[80px] px-12'>
        <p className='text-secondary gap-2 hover:gap-5 duration-100 cursor-default leading-none flex items-center'>
          <span className='mt-0.5'>[</span>
          <span>Popular Museums to Visit</span>
          <span className='mt-0.5'>]</span>
        </p>

        <div className=' w-full grid grid-cols-4 gap-5'>
          {popularMuseums.map((museums, index) => (
            <div
              key={index}
              className='w-full h-full bg-secondary/10  rounded-xl p-4'
            >
              <div className='w-full h-[200px] bg-secondary/10 rounded-lg relative overflow-hidden'></div>
              <div className='p-2 leading-none'>
                <p className='text-xl text-background '>{museums.name}</p>
                <p className='text-background/50'>{museums.location}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          size='xl'
          variant='secondary'
          className='flex items-center  pr-px!'
        >
          Browse all Museums <ArrowUpRight />
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
