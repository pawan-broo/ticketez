'use client';

import { Hero } from '@/components/feature';
import { ModeToggle } from '@/components/mode-toggle';
import React from 'react';

import { cubicBezier, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const text =
    'We have made it easy for you to book tickets for monuments and museums and more. Our platform is built to give you fast, secure and hassle-free way to enjoy the destinations you love.';

  return (
    <>
      <Hero />
      <div className='flex w-full  min-h-[50vh] flex-col   items-center justify-center border-b'>
        <div className='container  flex flex-col  items-center gap-8 border-x h-full justify-center  p-12'>
          <p className='text-muted-foreground gap-2 hover:gap-5 duration-100 cursor-default leading-none flex items-center'>
            <span className='mt-0.5'>[</span>
            <span>Our Vision</span>
            <span className='mt-0.5'>]</span>
          </p>

          <div className='inline-flex flex-wrap justify-center pr-0! '>
            {text.split(' ').map((value, index) => (
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
                  className='text-[40px] text-primary text-center leading-tight relative inline-flex flex-wrap overflow-hidden  '
                >
                  {value}&nbsp;
                </motion.span>
              </span>
            ))}
          </div>
          <Button size='xl' className='flex items-center  pr-px '>
            Browse all destinations
            <div className='h-full aspect-square justify-center p-[6px] flex items-center'>
              <div className='bg-background text-primary w-full h-full flex justify-center items-center rounded-sm'>
                <ArrowUpRight />
              </div>
            </div>
          </Button>
        </div>
      </div>

      <div className='w-full h-screen' />
    </>
  );
};

export default Home;
