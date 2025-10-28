'use client';

import React from 'react';

import { cubicBezier, motion } from 'framer-motion';
import { howWeWorkSteps } from './data';
import Link from 'next/link';

export const HowWeWork: React.FC = () => {
  const title = 'Plan your trip in 3 Steps.';
  const description =
    'Explore destinations, plan your trip, book securely in minutes. Get instant e-tickets on you email or phone number - ready to scan at gates for hassle free entry.';

  return (
    <div className='flex w-full   flex-col   items-center justify-center border-b'>
      <div className='container  flex flex-col  items-center gap-8 border-x h-full justify-center  py-[80px] px-12'>
        <p className='text-muted-foreground gap-2 hover:gap-5 duration-100 cursor-default leading-none flex items-center'>
          <span className='mt-0.5'>[</span>
          <span>How we Work</span>
          <span className='mt-0.5'>]</span>
        </p>

        <div className='flex flex-col items-center gap-1'>
          <p className='overflow-hidden'>
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
                  className='text-[40px] text-primary  font-flagfies  text-center leading-tight relative inline-flex flex-wrap overflow-hidden  '
                >
                  {value}&nbsp;
                </motion.span>
              </span>
            ))}
          </p>
          <p className='overflow-hidden max-w-[700px] text-center'>
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
                    delay: 0.1,
                  }}
                  className='relative inline-flex  text-lg leading-tight flex-wrap overflow-hidden text-center'
                  // className='text-[40px] text-primary  font-flagfies  text-center leading-tight relative inline-flex flex-wrap overflow-hidden  '
                >
                  {value}&nbsp;
                </motion.span>
              </span>
            ))}
          </p>
        </div>

        <div className='flex justify-center flex-wrap gap-8'>
          {howWeWorkSteps.map((step, index) => (
            <div
              key={index}
              className='w-[250px] p-4 border flex gap-5 flex-col justify-between rounded-lg'
            >
              <div className='flex flex-col gap-5'>
                <div className='flex justify-center items-center size-12 bg-primary rounded-sm'>
                  <p className='text-background'>0{index + 1}</p>
                </div>
                <div>
                  <p className='text-md font-medium'>{step.title}</p>
                  <p className='text-sm leading-tight text-muted-foreground'>
                    {step.description}
                  </p>
                </div>
              </div>
              <div>
                <Link
                  href='/'
                  className='text-sm underline underline-offset-2 to-muted-foreground'
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
