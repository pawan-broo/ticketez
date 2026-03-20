'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import { BookingInfoStep } from './BookingInfoStep'
import { PaymentStep } from './PaymentStep'
import { AuthDialog } from './AuthDialog'
import { authClient } from '@/lib/auth-client'

interface BookingDialogProps {
  placeSlug: string
  placeName: string
  placeLocation: string
  destinationType: 'monument' | 'museum'
  country: string
  state: string
  city: string
  ticketPrice: number
}

type Step = 1 | 2

interface BookingInfo {
  members: { name: string; age: number; email: string }[]
  visitDate: string | undefined
}

export const BookingDialog: React.FC<BookingDialogProps> = (props) => {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null)

  const handleBookTicketClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    const session = await authClient.getSession()

    if (session.data?.user.id) {
      setBookingOpen(true)
    } else {
      setAuthOpen(true)
    }
  }

  const handleAuthSuccess = () => {
    setAuthOpen(false)
    setBookingOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setBookingOpen(open)
    if (!open) {
      // Reset wizard state when dialog closes
      setStep(1)
      setBookingInfo(null)
    }
  }

  const dialogTitle = step === 1 ? 'Book Your Tickets' : 'Complete Payment'
  const dialogDescription =
    step === 1
      ? 'Fill in visitor details'
      : 'Scan QR and enter your UPI transaction ID'

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

      <Dialog open={bookingOpen} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <BookingInfoStep
              onNext={(data) => {
                setBookingInfo(data)
                setStep(2)
              }}
            />
          )}

          {step === 2 && bookingInfo && (
            <PaymentStep
              {...props}
              members={bookingInfo.members}
              visitDate={bookingInfo.visitDate}
              onBack={() => setStep(1)}
              onClose={() => setBookingOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
      />
    </>
  )
}
