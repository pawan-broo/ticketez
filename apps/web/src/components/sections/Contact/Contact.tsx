'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cubicBezier, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const Contact: React.FC = () => {
  const router = useRouter();

  const title = "Let's get you booked";
  const description =
    'From monuments to museums, we have got you covered. Plan your trip and enjoy the best experience.';

  return (
    <div className='w-full flex flex-col '>
      <div className='flex w-full  flex-col h-full  items-center justify-center border-b'>
        <div className='container flex flex-col relative overflow-hidden items-center gap-5 border-x h-full justify-center pt-20 p-12'>
          <p className='text-muted-foreground gap-2 hover:gap-5 duration-100 cursor-default leading-none flex items-center'>
            <span className='mt-0.5'>[</span>
            <span>Reach Out</span>
            <span className='mt-0.5'>]</span>
          </p>
          <div className='w-full h-full absolute top-0  left-0 grid grid-cols-30 grid-rows-7'>
            {Array.from({ length: 210 }).map((_, index) => (
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
                    className='text-primary font-flagfies  font-medium text-center text-[40px] relative inline-flex flex-wrap overflow-hidden  '
                  >
                    {value}&nbsp;
                  </motion.span>
                </span>
              ))}
            </p>

            <p className='inline-flex flex-wrap max-w-[700px] justify-center  '>
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

          <Button
            size='lg'
            className='flex items-center z-10 pr-px'
            onClick={() => router.push('/contact')}
          >
            Get in Touch
            <div className='h-full aspect-square justify-center p-[6px] flex items-center'>
              <div className='bg-background text-primary w-full h-full flex justify-center items-center rounded-sm'>
                <ArrowUpRight />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
