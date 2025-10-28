'use client';

import { ArrowUpRight, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import { heroImage, two } from '@/public';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

export const Hero: React.FC = () => {
  return (
    <div className='w-full h-screen flex flex-col '>
      <div className='flex w-full  flex-col h-full  items-center justify-center border-b'>
        <div className='container flex flex-col relative overflow-hidden items-center gap-8 border-x h-full justify-center pt-20 p-12'>
          <div className='w-full h-full absolute  top-0 left-0  grid grid-cols-15 grid-rows-6'>
            {Array.from({ length: 90 }).map((_, index) => (
              <div
                key={index}
                className='w-full h-full hover:bg-primary/5 border border-primary/2  duration-150 bg-transparent'
              />
            ))}
          </div>

          <div className=' flex z-10 mt-10  cursor-pointer bg-background items-center gap-4 rounded-lg border px-4 py-1 pr-1'>
            <p className='text-sm'>One click Booking</p>
            <div className='bg-primary flex h-7 w-7 items-center justify-center rounded-sm duration-100'>
              <ArrowUpRight className='w-5 text-white' />
            </div>
          </div>

          <div className='flex flex-col items-center gap-2 justify-center'>
            <div className='overflow-hidden h-14'>
              <motion.p
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
                className='text-primary font-flagfies overflow-hidden font-medium text-center text-[60px] leading-none'
              >
                Find next destination to visit
              </motion.p>
            </div>
            <div>
              <div className='overflow-hidden h-6'>
                <motion.p
                  initial={{ y: 40 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className='text-center text-lg  leading-tight'
                >
                  Introducing Titiesfy, an effortless ticket booking experience
                  on your fingertips.
                </motion.p>
              </div>
              <div className='overflow-hidden h-6'>
                <motion.p
                  initial={{ y: 40 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className='text-center text-lg  leading-tight'
                >
                  Visit monuments while we take care of the hassle of bookings.
                </motion.p>
              </div>
            </div>
          </div>

          <div className='relative '>
            <Input
              placeholder='Search by your city'
              className='w-[400px] rounded-lg px-5 bg-background py-6'
            />
            <Button
              size='icon'
              className='absolute top-1/2 right-2 -translate-y-1/2 rounded-sm shadow-none'
            >
              <Search />
            </Button>
          </div>
        </div>
        <div className='flex justify-center w-full border-t'>
          <div className='h-12 flex items-center bg-primary container text-white text-lg  relative overflow-hidden w-full'>
            <Marquee className=''>
              <p className='px-5'>EFFORTLESS TICKET BOOKING SYSTEM</p> &#9733;
              <p className='px-5'>GET A TICKET</p> &#9733;
              <p className='px-5'>VISIT YOUR DESTINATIONS WITH EASE</p> &#9733;
              <p className='px-5'>TRAVEL MONUMENTS AND MUSEUMS</p> &#9733;
              <p className='px-5'>ENJOY THE BEST HUSTLE FREE BOOKING</p> &#9733;
            </Marquee>
          </div>
        </div>
      </div>
      <div className='flex w-full items-center relative overflow-hidden justify-center h-[350px] border-b'>
        <div className='container flex relative overflow-hidden w-full h-full flex-col items-center gap-8 border-x p-8'>
          <Image
            src={heroImage}
            blurDataURL=''
            alt='heroImage'
            fill
            unoptimized
            className='object-cover object-top grayscale-100'
          />
        </div>
      </div>
    </div>
  );
};
