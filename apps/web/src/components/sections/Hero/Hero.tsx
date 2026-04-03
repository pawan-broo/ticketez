'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { heroImage } from '@/public';

import { cubicBezier, motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { HeroSearchBar } from '@/components/feature';

export const Hero: React.FC = () => {
  const title = 'Find next heritage to visit';
  const description =
    'Introducing Ticketez, an effortless ticket booking experience on your fingertips. Visit monuments while we take care of the hassle of bookings.';

  return (
    <div className='w-full h-screen flex flex-col '>
      <div className='flex w-full  flex-col h-full  items-center justify-center border-b'>
        <div className='container flex flex-col  relative items-center gap-8 border-x h-full justify-center pt-16 p-4 sm:p-8 md:p-12'>
          <div className='w-full h-full absolute top-0  left-0 grid grid-cols-20 grid-rows-8'>
            {Array.from({ length: 160 }).map((_, index) => (
              <motion.div
                key={index}
                whileHover={{
                  backgroundColor: 'oklch(0.4341 0.0392 41.9938 / 0.05)',
                  transition: { duration: 0.5 },
                }}
                transition={{
                  duration: 0.5,
                  ease: cubicBezier(0.7, 0.1, 0.01, 1),
                  delay: 0.5,
                }}
                className='w-full h-full border    border-primary/1'
              />
            ))}
          </div>



          <div className='flex flex-col z-10 pointer-events-none items-center gap-2 justify-center'>
            <p className='inline-flex  flex-wrap justify-center  '>
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
                    className='text-[36px] sm:text-[48px] md:text-[60px] font-flagfies text-primary text-center leading-tight relative inline-flex flex-wrap overflow-hidden  '
                  >
                    {value}&nbsp;
                  </motion.span>
                </span>
              ))}
            </p>
            <p className='inline-flex  max-w-[700px] flex-wrap justify-center  '>
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

          <div className='flex flex-col z-10 items-center gap-2'>
            <HeroSearchBar />
            <p>Currently operational only in Rajasthan, India.</p>
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
