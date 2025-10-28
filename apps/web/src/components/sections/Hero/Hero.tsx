'use client';

import { ArrowUpRight, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import { heroImage, two } from '@/public';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { cubicBezier, motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

export const Hero: React.FC = () => {
  const title = 'Find next destination to visit';
  const description =
    'Introducing Titiesfy, an effortless ticket booking experience on your fingertips. Visit monuments while we take care of the hassle of bookings.';

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
            <p className='text-sm'>#3 clicks Booking</p>
            <div className='bg-primary flex h-7 w-7 items-center justify-center rounded-sm duration-100'>
              <ArrowUpRight className='w-5 text-white' />
            </div>
          </div>

          <div className='flex flex-col items-center gap-2 justify-center'>
            <p className='inline-flex flex-wrap justify-center  '>
              {title.split(' ').map((value, index) => (
                <span className='overflow-hidden' key={index}>
                  <motion.span
                    variants={{
                      show: {
                        y: '0',
                      },
                      hide: {
                        y: '100%',
                      },
                    }}
                    initial={{
                      y: '100%',
                    }}
                    whileInView='show'
                    transition={{
                      duration: 0.5,
                      ease: cubicBezier(0.7, 0.1, 0.01, 1),
                    }}
                    className='text-[60px] font-flagfies text-primary text-center leading-tight relative inline-flex flex-wrap overflow-hidden  '
                  >
                    {value}&nbsp;
                  </motion.span>
                </span>
              ))}
            </p>
            <p className='inline-flex max-w-[700px] flex-wrap justify-center  '>
              {description.split(' ').map((value, index) => (
                <span className='overflow-hidden' key={index}>
                  <motion.span
                    variants={{
                      show: {
                        y: '0',
                      },
                      hide: {
                        y: '100%',
                      },
                    }}
                    initial={{
                      y: '100%',
                    }}
                    whileInView='show'
                    transition={{
                      duration: 0.5,
                      delay: 0.1,
                      ease: cubicBezier(0.7, 0.1, 0.01, 1),
                    }}
                    className='text-center text-lg  leading-tight relative inline-flex flex-wrap overflow-hidden  '
                  >
                    {value}&nbsp;
                  </motion.span>
                </span>
              ))}
            </p>
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
