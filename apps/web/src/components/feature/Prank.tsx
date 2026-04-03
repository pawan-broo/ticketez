'use client';
import React, { useRef, useState } from 'react';

export const Prank: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0;
    audio.loop = true;
    audio.play();
    setStarted(true);
  };

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      <audio
        ref={audioRef}
        src='/prank.mp3'
        preload='auto'
        onPause={(e) => e.currentTarget.play()} // re-play if somehow paused
      />

      {started && (
        <div>
          <p>Lots of LOVE from Prashant</p>
        </div>
      )}

      {!started && (
        <button
          onClick={handleStart}
          className='px-6 py-3 bg-blue-500 text-white rounded-xl text-lg font-semibold hover:bg-blue-600 transition'
        >
          Click me 🎉
        </button>
      )}
    </div>
  );
};
