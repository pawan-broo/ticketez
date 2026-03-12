'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';

const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeSVG),
  {
    ssr: false,
  },
);

interface ConfirmationPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ params }) => {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const {
    data: bookingData,
    isLoading,
    error,
  } = trpc.booking.getById.useQuery({ bookingId: id }, { enabled: !!id });

  // Handle error in useEffect instead of during render
  useEffect(() => {
    if (error && !isLoading && id) {
      router.push('/');
    }
  }, [error, isLoading, id, router]);

  if (!id || isLoading) {
    return (
      <div className='flex w-full items-center justify-center min-h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className='flex w-full items-center justify-center min-h-screen'>
        <p>Booking not found. Redirecting...</p>
      </div>
    );
  }

  const { booking, members } = bookingData;

  // const confirmationUrl = `${
  //   process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  // }/tickets/confirmation/${id}`;

  const confirmationUrl =
    process.env.NODE_ENV === 'production'
      ? `https://ticketez-web-di6t.vercel/tickets/confirmation/${id}`
      : `http://localhost:3001/tickets/confirmation/${id}`;

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b'>
      <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
        <div className='flex items-center gap-3'>
          <div>
            <h1 className='text-2xl font-semibold'>Booking Confirmed!</h1>
            <p className='text-muted-foreground'>
              Your ticket has been successfully booked
            </p>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-8'>
          <div className='col-span-2 flex flex-col gap-6'>
            <div className='border rounded-lg p-6 flex flex-col gap-4'>
              <div className='grid grid-cols-4 gap-3'>
                <div className='w-full h-[150px] bg-primary/20 rounded-lg' />
                <div className='w-full h-[150px] bg-primary/20 rounded-lg' />
                <div className='w-full h-[150px] bg-primary/20 rounded-lg' />
                <div className='w-full h-[150px] bg-primary/20 rounded-lg' />
              </div>
              <div>
                <h2 className='text-xl font-semibold'>{booking.placeName}</h2>
                <div className='flex items-start gap-2 text-muted-foreground'>
                  <MapPin className='w-4' />
                  <p>{booking.placeLocation}</p>
                </div>
              </div>
            </div>

            <div className='border rounded-lg p-6 flex flex-col gap-4'>
              <div className='flex items-center gap-2'>
                <Users className='w-5' />
                <h3 className='font-semibold'>Visitor Details</h3>
              </div>

              <div className='flex flex-col gap-3'>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className='p-4 bg-accent/40 rounded-lg flex justify-between'
                  >
                    <div>
                      <p className='font-medium'>{member.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        Age: {member.age} | {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='border rounded-lg p-6 flex flex-col gap-4'>
              <h3 className='font-semibold'>Booking Information</h3>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Booking ID</p>
                  <p className='font-mono text-sm'>{booking.id}</p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Booking Date</p>
                  <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                </div>

                {booking.visitDate && (
                  <div>
                    <p className='text-sm text-muted-foreground'>Visit Date</p>
                    <p className='flex items-center gap-1'>
                      <Calendar className='w-4' />
                      {new Date(booking.visitDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className='text-sm text-muted-foreground'>Total Members</p>
                  <p>{booking.totalMembers}</p>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <Badge variant='outline' className='capitalize'>
                    {booking.status}
                  </Badge>
                </div>

                <div>
                  <p className='text-sm text-muted-foreground'>
                    Payment Status
                  </p>
                  <Badge variant='outline' className='capitalize'>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='border rounded-lg p-6 flex flex-col items-center gap-4 sticky top-[150px]'>
              <h3 className='font-semibold'>Your Ticket QR Code</h3>
              <div className='bg-white p-4 rounded-lg'>
                <QRCodeSVG value={confirmationUrl} size={200} />
              </div>
              <p className='text-sm text-center text-muted-foreground'>
                Show this QR code at the entry gate
              </p>
              <p className='text-xs text-center text-muted-foreground'>
                This ticket has been sent to all registered emails
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
