'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { BookingForm } from './BookingForm';
import { AuthDialog } from './AuthDialog';
import { authClient } from '@/lib/auth-client';

interface BookingDialogProps {
  placeSlug: string;
  placeName: string;
  placeLocation: string;
  destinationType: 'monument' | 'museum';
  country: string;
  state: string;
  city: string;
}

export const BookingDialog: React.FC<BookingDialogProps> = (props) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const handleBookTicketClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const session = await authClient.getSession();

    if (session.data?.user.id) {
      setBookingOpen(true);
    } else {
      setAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    setBookingOpen(true);
  };

  return (
    <>
      <Button
        size='sm'
        className='flex items-center z-10 pr-px'
        onClick={handleBookTicketClick}
      >
        Book Tickets
        <div className='h-full aspect-square justify-center p-[6px] flex items-center'>
          <div className='bg-background text-primary w-full h-full flex justify-center items-center rounded-sm'>
            <ArrowUpRight />
          </div>
        </div>
      </Button>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Book Your Tickets</DialogTitle>
            <DialogDescription>
              Fill in the details for all visiting members
            </DialogDescription>
          </DialogHeader>
          <BookingForm {...props} />
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        // onSuccess={handleAuthSuccess}
      />
    </>
  );
};
