import { Button } from '@/components/ui/button';
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className='h-screen w-full flex flex-col items-center justify-center'>
      Hero
      <Button>Hello</Button>
    </div>
  );
};
