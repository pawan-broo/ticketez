'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import {
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/utils/trpc';
import { AdminGuard } from '@/app/(admin)/_components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingRow = {
  id: string;
  placeName: string;
  placeLocation: string;
  city: string;
  state: string;
  visitDate: Date | string | null;
  totalMembers: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  transactionId: string | null;
  adminNote: string | null;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

const formatDate = (date: Date | string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const truncateId = (id: string) => `${id.slice(0, 8)}...`;

// ─── Badges ───────────────────────────────────────────────────────────────────

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <Badge className={map[status] ?? 'bg-muted text-muted-foreground border'}>
      {status}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    unverified: 'bg-orange-100 text-orange-800 border-orange-200',
    verified: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <Badge className={map[status] ?? 'bg-muted text-muted-foreground border'}>
      {status}
    </Badge>
  );
}

// ─── Verify Dialog ────────────────────────────────────────────────────────────

interface VerifyDialogProps {
  booking: BookingRow | null;
  onClose: () => void;
  onSuccess: () => void;
}

function VerifyDialog({ booking, onClose, onSuccess }: VerifyDialogProps) {
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    if (booking) setAdminNote('');
  }, [booking]);

  const confirmMutation = trpc.booking.confirmPayment.useMutation({
    onSuccess: () => {
      toast.success('Payment verified — confirmation email sent to members.');
      onSuccess();
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!booking) return null;

  return (
    <Dialog open={!!booking} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
          <DialogDescription>
            Confirming this will mark the booking as verified and notify all
            members via email.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          {/* Booking details */}
          <div className='border rounded-lg p-4 space-y-2 bg-muted/30 text-sm'>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Booking ID</span>
              <span className='font-mono text-xs font-medium break-all text-right'>
                {booking.id}
              </span>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Place</span>
              <span className='font-medium text-right'>{booking.placeName}</span>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>User</span>
              <div className='text-right'>
                <p className='font-medium'>{booking.userName ?? 'Unknown'}</p>
                <p className='text-xs text-muted-foreground'>
                  {booking.userEmail}
                </p>
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Amount</span>
              <span className='font-semibold text-green-700'>
                {formatAmount(booking.totalAmount)}
              </span>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Transaction ID</span>
              <span className='font-mono text-xs break-all text-right'>
                {booking.transactionId ?? '—'}
              </span>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Members</span>
              <span>{booking.totalMembers}</span>
            </div>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Visit Date</span>
              <span>{formatDate(booking.visitDate)}</span>
            </div>
          </div>

          {/* Admin note */}
          <div className='space-y-1.5'>
            <Label htmlFor='vd-note'>
              Admin Note{' '}
              <span className='text-muted-foreground font-normal'>(optional)</span>
            </Label>
            <Textarea
              id='vd-note'
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder='Any internal note about this verification...'
              className='min-h-[70px]'
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={confirmMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className='bg-green-600 hover:bg-green-700 text-white'
            onClick={() =>
              confirmMutation.mutate({
                bookingId: booking.id,
                adminNote: adminNote.trim() || undefined,
              })
            }
            disabled={confirmMutation.isPending}
          >
            <CheckCircle2 className='size-4' />
            {confirmMutation.isPending
              ? 'Confirming...'
              : 'Confirm & Notify User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyDialogBooking, setVerifyDialogBooking] =
    useState<BookingRow | null>(null);

  const {
    data: bookings,
    isLoading,
    refetch,
  } = trpc.booking.getAllBookings.useQuery({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
    search: searchQuery.trim() || undefined,
    limit: 100,
    offset: 0,
  });

  const rejectMutation = trpc.booking.rejectPayment.useMutation({
    onSuccess: () => {
      toast.success('Booking rejected and marked as cancelled.');
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleReject = (booking: BookingRow) => {
    if (
      !window.confirm(
        `Reject booking for "${booking.placeName}" by ${booking.userName ?? 'user'}?\nThis will cancel the booking.`,
      )
    )
      return;
    rejectMutation.mutate({ bookingId: booking.id, adminNote: '' });
  };

  const selectClass =
    'border-input h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] min-w-[160px]';

  return (
    <AdminGuard>
      <div className='container border-x min-h-full px-12 py-[80px] space-y-8'>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-medium text-primary'>Bookings</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage and verify all bookings
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => refetch()}
          title='Refresh'
        >
          <RefreshCw className='size-4' />
          Refresh
        </Button>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className='flex flex-wrap gap-3 items-center'>
        {/* Search */}
        <div className='relative flex-1 min-w-[200px] max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by place, user, email or ID...'
            className='pl-9'
          />
        </div>

        {/* Status filter */}
        <div className='flex items-center gap-2'>
          <Label htmlFor='status-filter' className='text-sm shrink-0'>
            Status
          </Label>
          <select
            id='status-filter'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='confirmed'>Confirmed</option>
            <option value='cancelled'>Cancelled</option>
          </select>
        </div>

        {/* Payment filter */}
        <div className='flex items-center gap-2'>
          <Label htmlFor='payment-filter' className='text-sm shrink-0'>
            Payment
          </Label>
          <select
            id='payment-filter'
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className={selectClass}
          >
            <option value='all'>All Payments</option>
            <option value='unverified'>Unverified</option>
            <option value='verified'>Verified</option>
            <option value='failed'>Failed</option>
          </select>
        </div>

        {/* Clear filters */}
        {(statusFilter !== 'all' ||
          paymentFilter !== 'all' ||
          searchQuery) && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              setStatusFilter('all');
              setPaymentFilter('all');
              setSearchQuery('');
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Result count */}
      {!isLoading && bookings && (
        <p className='text-xs text-muted-foreground -mt-4'>
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className='border rounded-lg overflow-hidden'>
        {isLoading ? (
          <div className='p-6 space-y-3'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded' />
            ))}
          </div>
        ) : !bookings?.length ? (
          <div className='px-6 py-16 text-center text-muted-foreground text-sm'>
            No bookings found matching your filters.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/40'>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap'>
                    Booking ID
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    User
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Place
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap'>
                    Visit Date
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Members
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Amount
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap'>
                    Transaction ID
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Status
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Payment
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-b last:border-0 ${
                      i % 2 === 0 ? 'bg-background' : 'bg-accent/20'
                    }`}
                  >
                    {/* Booking ID */}
                    <td className='px-4 py-3'>
                      <span
                        className='font-mono text-xs text-muted-foreground cursor-default'
                        title={b.id}
                      >
                        {truncateId(b.id)}
                      </span>
                    </td>

                    {/* User */}
                    <td className='px-4 py-3'>
                      <div className='font-medium whitespace-nowrap'>
                        {b.userName ?? 'Unknown'}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {b.userEmail}
                      </div>
                    </td>

                    {/* Place */}
                    <td className='px-4 py-3'>
                      <div className='font-medium whitespace-nowrap'>
                        {b.placeName}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {b.city}, {b.state}
                      </div>
                    </td>

                    {/* Visit Date */}
                    <td className='px-4 py-3 text-muted-foreground whitespace-nowrap'>
                      {formatDate(b.visitDate)}
                    </td>

                    {/* Members */}
                    <td className='px-4 py-3 text-right'>{b.totalMembers}</td>

                    {/* Amount */}
                    <td className='px-4 py-3 text-right font-medium whitespace-nowrap'>
                      {formatAmount(b.totalAmount)}
                    </td>

                    {/* Transaction ID */}
                    <td className='px-4 py-3'>
                      {b.transactionId ? (
                        <span
                          className='font-mono text-xs text-muted-foreground cursor-default'
                          title={b.transactionId}
                        >
                          {b.transactionId.length > 16
                            ? `${b.transactionId.slice(0, 16)}...`
                            : b.transactionId}
                        </span>
                      ) : (
                        <span className='text-muted-foreground'>—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className='px-4 py-3'>
                      <BookingStatusBadge status={b.status} />
                    </td>

                    {/* Payment */}
                    <td className='px-4 py-3'>
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </td>

                    {/* Actions */}
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2 whitespace-nowrap'>
                        {/* Verify button — only for unverified+pending */}
                        {b.paymentStatus === 'unverified' &&
                          b.status === 'pending' && (
                            <Button
                              size='sm'
                              className='bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs'
                              onClick={() =>
                                setVerifyDialogBooking(b as BookingRow)
                              }
                            >
                              <CheckCircle2 className='size-3.5' />
                              Verify
                            </Button>
                          )}

                        {/* Reject button — not for already cancelled */}
                        {b.status !== 'cancelled' && (
                          <Button
                            size='sm'
                            variant='outline'
                            className='border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 h-7 px-2 text-xs'
                            disabled={rejectMutation.isPending}
                            onClick={() => handleReject(b as BookingRow)}
                          >
                            <XCircle className='size-3.5' />
                            Reject
                          </Button>
                        )}

                        {/* View ticket — always */}
                        <Button
                          size='sm'
                          variant='outline'
                          className='h-7 px-2 text-xs'
                          asChild
                        >
                          <Link
                            href={`/tickets/confirmation/${b.id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <ExternalLink className='size-3.5' />
                            View
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Verify Dialog ─────────────────────────────────────────────────────── */}
      <VerifyDialog
        booking={verifyDialogBooking}
        onClose={() => setVerifyDialogBooking(null)}
        onSuccess={() => refetch()}
      />
      </div>
    </AdminGuard>
  );
}
