'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';

const ActivityPage: React.FC = () => {
  const router = useRouter();
  const { data: bookings, isLoading } = trpc.booking.getUserBookings.useQuery();

  if (isLoading) {
    return (
      <div className='flex w-full items-center justify-center min-h-screen'>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b min-h-screen'>
        <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
          <div>
            <h1 className='text-3xl font-bold'>My Activity</h1>
            <p className='text-muted-foreground mt-2'>
              View all your bookings and tickets
            </p>
          </div>
          <div className='flex flex-col items-center justify-center py-20 gap-4'>
            <p className='text-lg text-muted-foreground'>No bookings yet</p>
            <button
              onClick={() => router.push('/')}
              className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90'
            >
              Explore Destinations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b min-h-screen'>
      <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
        <div>
          <h1 className='text-3xl font-bold'>My Activity</h1>
          <p className='text-muted-foreground mt-2'>
            View all your bookings and tickets
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => router.push(`/tickets/confirmation/${booking.id}`)}
              className='border rounded-lg p-3 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer'
            >
              <div className='w-full h-[200px] bg-primary/20 rounded-lg' />

              <div className='px-2 flex flex-col'>
                <h3 className='text-md font-semibold'>{booking.placeName}</h3>
                <div className='text-muted-foreground text-sm'>
                  <p className='line-clamp-2'>{booking.placeLocation}</p>
                  <p className='line-clamp-2'>
                    Booked on:{' '}
                    {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
