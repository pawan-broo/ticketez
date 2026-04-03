'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/utils/trpc'
import { toast } from 'sonner'
import Image from 'next/image'

const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((mod) => mod.QRCodeSVG),
  { ssr: false },
)

interface PaymentStepProps {
  placeSlug: string
  placeName: string
  placeLocation: string
  destinationType: 'monument' | 'museum'
  country: string
  state: string
  city: string
  ticketPrice: number
  members: { name: string; age: number; email: string }[]
  visitDate: string | undefined
  onBack: () => void
  onClose: () => void
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  placeSlug,
  placeName,
  placeLocation,
  destinationType,
  country,
  state,
  city,
  ticketPrice,
  members,
  visitDate,
  onBack,
  onClose,
}) => {
  const router = useRouter()
  const [transactionId, setTransactionId] = useState('')
  const [txError, setTxError] = useState('')

  const totalAmount = ticketPrice * members.length

  const upiVpa = process.env.NEXT_PUBLIC_UPI_VPA ?? ''
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME ?? 'Ticketez'
  const upiString = upiVpa
    ? `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiName)}&am=${(totalAmount / 100).toFixed(2)}&cu=INR`
    : ''

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: (data) => {
      toast.success('Booking submitted! Awaiting payment verification.')
      onClose()
      router.push(`/tickets/confirmation/${data.bookingId}`)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create booking')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionId.trim()) {
      setTxError('Please enter your UPI transaction ID')
      return
    }

    setTxError('')

    await createBooking.mutateAsync({
      placeSlug,
      placeName,
      placeLocation,
      destinationType,
      country,
      state,
      city,
      visitDate,
      members,
      totalAmount,
      transactionId: transactionId.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      {/* Amount summary */}
      <div className='rounded-lg border bg-accent/30 px-4 py-3 flex items-baseline justify-between'>
        <div>
          <p className='text-sm text-muted-foreground'>Total Amount</p>
          <p className='text-2xl font-semibold'>
            ₹{(totalAmount / 100).toFixed(2)}
          </p>
        </div>
        <p className='text-sm text-muted-foreground'>
          {members.length} {members.length === 1 ? 'ticket' : 'tickets'} ×
          ₹{(ticketPrice / 100).toFixed(2)}
        </p>
      </div>

      {/* QR Code */}
      <div className='flex flex-col items-center gap-3'>
        <div className='bg-white p-4 rounded-lg border inline-flex'>
        <Image src="/qrcode.png" alt="qrcode" width={180} height={180} />
        </div>




        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
UPI ID: parthsarathisharma02@oksbi
          </p>
        </div>
      </div>

      {/* Transaction ID */}
      <div className='flex flex-col gap-2'>
        <Label htmlFor='transactionId'>
          Transaction ID <span className='text-destructive'>*</span>
        </Label>
        <Input
          id='transactionId'
          value={transactionId}
          onChange={(e) => {
            setTransactionId(e.target.value)
            if (txError) setTxError('')
          }}
          placeholder='Enter UPI transaction / UTR ID'
        />
        {txError && (
          <p className='text-xs text-destructive'>{txError}</p>
        )}
        <p className='text-xs text-muted-foreground'>
          After completing the payment, enter the transaction ID / UTR number
          from your UPI app.
        </p>
      </div>

      {/* Actions */}
      <div className='flex items-center justify-between gap-3 pt-1'>
        <Button
          type='button'
          variant='outline'
          onClick={onBack}
          disabled={createBooking.isPending}
        >
          <ArrowLeft className='w-4' />
          Back
        </Button>

        <Button
          type='submit'
          size='lg'
          disabled={createBooking.isPending}
          className='flex items-center pr-px'
        >
          {createBooking.isPending ? 'Submitting...' : 'Submit Booking'}
          <div className='h-full aspect-square justify-center p-[6px] flex items-center'>
            <div className='bg-background text-primary w-full h-full flex justify-center items-center rounded-sm'>
              <ArrowUpRight />
            </div>
          </div>
        </Button>
      </div>
    </form>
  )
}
