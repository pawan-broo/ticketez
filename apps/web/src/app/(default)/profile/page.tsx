'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Pencil, Check, X, UserCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { data, isPending, refetch } = authClient.useSession();
  const { data: bookings, isLoading: bookingsLoading } =
    trpc.booking.getUserBookings.useQuery();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (!isPending && !data?.session?.id) {
      router.push('/login');
    }
  }, [isPending, data, router]);

  useEffect(() => {
    if (data?.user?.name) {
      setNewName(data.user.name);
    }
  }, [data?.user?.name]);

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    try {
      await authClient.updateUser({ name: newName.trim() });
      await refetch();
      toast.success('Name updated successfully');
      setEditingName(false);
    } catch {
      toast.error('Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNewName(data?.user?.name ?? '');
    setEditingName(false);
  };

  if (isPending) {
    return (
      <div className='flex w-full items-center justify-center min-h-screen'>
        <p className='text-muted-foreground'>Loading profile...</p>
      </div>
    );
  }

  if (!data?.session?.id) {
    return null;
  }

  const user = data.user;

  const totalBookings = bookings?.length ?? 0;
  const confirmedBookings =
    bookings?.filter((b) => b.status === 'confirmed').length ?? 0;
  const pendingBookings =
    bookings?.filter((b) => b.status === 'pending').length ?? 0;
  const cancelledBookings =
    bookings?.filter((b) => b.status === 'cancelled').length ?? 0;

  const recentBookings = bookings?.slice(0, 4) ?? [];

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b '>
      <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
        {/* Page Header */}
        <div>
          <h1 className='text-3xl font-bold'>My Profile</h1>
          <p className='text-muted-foreground mt-2'>
            Manage your account and view your booking history
          </p>
        </div>

        {/* User Card */}
        <div className='border rounded-lg p-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8'>
          <Avatar className='size-20 shrink-0'>
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? 'User'}
            />
            <AvatarFallback className='text-xl font-semibold'>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className='flex flex-col gap-3 flex-1'>
            {/* Name row */}
            {editingName ? (
              <div className='flex items-center gap-2'>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='text-2xl font-bold h-auto py-1 max-w-xs'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                />
                <Button
                  size='sm'
                  onClick={handleSaveName}
                  disabled={savingName}
                >
                  <Check className='size-4' />
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleCancelEdit}
                  disabled={savingName}
                >
                  <X className='size-4' />
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <h2 className='text-2xl font-bold'>
                  {user.name ?? 'Anonymous'}
                </h2>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0'
                  onClick={() => setEditingName(true)}
                  title='Edit name'
                >
                  <Pencil className='size-4' />
                </Button>
              </div>
            )}

            <p className='text-muted-foreground'>{user.email}</p>

            <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
              <UserCircle className='size-4' />
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className='grid grid-cols-4 gap-4'>
          {[
            { label: 'Total Bookings', value: totalBookings },
            { label: 'Confirmed', value: confirmedBookings },
            { label: 'Pending', value: pendingBookings },
            { label: 'Cancelled', value: cancelledBookings },
          ].map((stat) => (
            <div
              key={stat.label}
              className='border rounded-lg p-5 flex flex-col gap-1'
            >
              <span className='text-3xl font-bold'>
                {bookingsLoading ? '—' : stat.value}
              </span>
              <span className='text-sm text-muted-foreground'>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>Recent Bookings</h2>
            {totalBookings > 0 && (
              <Link
                href='/activity'
                className='text-sm text-primary hover:underline'
              >
                View All Activity →
              </Link>
            )}
          </div>

          {bookingsLoading ? (
            <div className='grid grid-cols-4 gap-6'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className='border rounded-lg p-3 flex flex-col gap-2 animate-pulse'
                >
                  <div className='w-full h-[200px] bg-muted rounded-lg' />
                  <div className='px-2 flex flex-col gap-2'>
                    <div className='h-4 bg-muted rounded w-3/4' />
                    <div className='h-3 bg-muted rounded w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 gap-4'>
              <p className='text-lg text-muted-foreground'>No bookings yet</p>
              <Button onClick={() => router.push('/')}>
                Explore Destinations
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-4 gap-6'>
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() =>
                    router.push(`/tickets/confirmation/${booking.id}`)
                  }
                  className='border rounded-lg p-3 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer'
                >
                  <div className='w-full h-[200px] bg-primary/20 rounded-lg' />
                  <div className='px-2 flex flex-col'>
                    <h3 className='text-md font-semibold'>
                      {booking.placeName}
                    </h3>
                    <div className='text-muted-foreground text-sm'>
                      <p className='line-clamp-2'>{booking.placeLocation}</p>
                      <p className='line-clamp-2'>
                        Booked on:{' '}
                        {new Date(booking.bookingDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
