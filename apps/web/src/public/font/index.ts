import localFont from 'next/font/local';

export const satoshi = localFont({
  src: [
    {
      path: './satoshi/Satoshi-Regular.otf',
      weight: '400',
    },
     {
      path: './satoshi/Satoshi-Medium.otf',
      weight: '500',
    },
  ],
});
