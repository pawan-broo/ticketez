'use client';

import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

interface BookingFormProps {
  placeSlug: string;
  placeName: string;
  placeLocation: string;
  destinationType: 'monument' | 'museum';
  country: string;
  state: string;
  city: string;
}

interface Member {
  id: string;
  name: string;
  age: string;
  email: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  placeSlug,
  placeName,
  placeLocation,
  destinationType,
  country,
  state,
  city,
}) => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([
    { id: crypto.randomUUID(), name: '', age: '', email: '' },
  ]);
  const [visitDate, setVisitDate] = useState('');

  // Use React Query's useMutation with tRPC options

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: (data) => {
      toast.success('Booking confirmed!');
      router.push(`/tickets/confirmation/${data.bookingId}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });

  const addMember = () => {
    setMembers([
      ...members,
      { id: crypto.randomUUID(), name: '', age: '', email: '' },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof Member, value: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validMembers = members.map((m) => ({
      name: m.name,
      age: parseInt(m.age),
      email: m.email,
    }));

    const hasInvalidMember = validMembers.some(
      (m) => !m.name || !m.email || isNaN(m.age) || m.age < 1,
    );

    if (hasInvalidMember) {
      toast.error('Please fill all member details correctly');
      return;
    }

    await createBooking.mutateAsync({
      placeSlug,
      placeName,
      placeLocation,
      destinationType,
      country,
      state,
      city,
      visitDate: visitDate || undefined,
      members: validMembers,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='visitDate'>Visit Date (Optional)</Label>
        <Input
          id='visitDate'
          type='date'
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Label>Members</Label>
          <Button type='button' variant='outline' size='sm' onClick={addMember}>
            <Plus className='w-4' /> Add Member
          </Button>
        </div>

        {members.map((member, index) => (
          <div
            key={member.id}
            className='flex flex-col gap-3 p-4 pt-3 border rounded-lg'
          >
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Member {index + 1}</p>
              {members.length > 1 && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeMember(member.id)}
                >
                  <Minus className='w-4' />
                </Button>
              )}
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div className='flex flex-col gap-1'>
                <Label htmlFor={`name-${member.id}`}>Name</Label>
                <Input
                  id={`name-${member.id}`}
                  value={member.name}
                  onChange={(e) =>
                    updateMember(member.id, 'name', e.target.value)
                  }
                  placeholder='Full name'
                  required
                />
              </div>

              <div className='flex flex-col gap-1'>
                <Label htmlFor={`age-${member.id}`}>Age</Label>
                <Input
                  id={`age-${member.id}`}
                  type='number'
                  value={member.age}
                  onChange={(e) =>
                    updateMember(member.id, 'age', e.target.value)
                  }
                  placeholder='Age'
                  min='1'
                  max='120'
                  required
                />
              </div>

              <div className='flex flex-col gap-1'>
                <Label htmlFor={`email-${member.id}`}>Email</Label>
                <Input
                  id={`email-${member.id}`}
                  type='email'
                  value={member.email}
                  onChange={(e) =>
                    updateMember(member.id, 'email', e.target.value)
                  }
                  placeholder='email@example.com'
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='flex gap-2 justify-end'>
        <Button
          type='submit'
          size='lg'
          disabled={createBooking.isPending}
          className='flex items-center z-10 pr-px'
        >
          {createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
          <div className='h-full aspect-square justify-center p-[6px] flex items-center'>
            <div className='bg-background text-primary w-full h-full flex justify-center items-center rounded-sm'>
              <ArrowUpRight />
            </div>
          </div>
        </Button>
      </div>
    </form>
  );
};
