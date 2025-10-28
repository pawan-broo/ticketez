import React from 'react';

// components
import {
  Hero,
  HowWeWork,
  PopularMonuments,
  Vision,
  PopularMuseums,
  Contact,
} from '@/components/sections';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Vision />
      <PopularMonuments />
      <HowWeWork />
      <PopularMuseums />
      <Contact />
    </>
  );
};

export default Home;
