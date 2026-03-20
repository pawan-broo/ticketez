'use client';

import React from 'react';
import Link from 'next/link';
import {
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
  Users,
  ArrowRight,
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { AdminGuard } from '@/app/(admin)/_components/AdminGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatAmount = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

const formatDate = (date: Date | string | null) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// ─── Status Badges ───────────────────────────────────────────────────────────

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <Badge className={map[status] ?? 'bg-muted text-muted-foreground'}>
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
    <Badge className={map[status] ?? 'bg-muted text-muted-foreground'}>
      {status}
    </Badge>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

function StatCard({ label, value, icon, colorClass }: StatCardProps) {
  return (
    <div className={`border rounded-lg p-6 flex items-center gap-4 ${colorClass}`}>
      <div className='shrink-0'>{icon}</div>
      <div className='min-w-0'>
        <p className='text-2xl font-semibold leading-none'>{value}</p>
        <p className='text-sm text-muted-foreground mt-1'>{label}</p>
      </div>
    </div>
  );
}

// ─── Skeleton helpers ────────────────────────────────────────────────────────

function StatsRowSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4'>
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className='h-[88px] rounded-lg' />
      ))}
    </div>
  );
}

function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className='space-y-2'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex gap-4'>
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className='h-9 flex-1 rounded' />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } =
    trpc.admin.getStats.useQuery();

  const { data: placeStats, isLoading: placeStatsLoading } =
    trpc.admin.getPlaceStats.useQuery();

  const { data: recentBookings, isLoading: bookingsLoading } =
    trpc.admin.getRecentBookings.useQuery({ limit: 10 });

  return (
    <AdminGuard>
      <div className='container border-x min-h-full px-12 py-[80px] space-y-10'>
      {/* Page header */}
      <div>
        <h1 className='text-3xl font-medium text-primary'>Dashboard</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Overview of all activity
        </p>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      {statsLoading ? (
        <StatsRowSkeleton />
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4'>
          <StatCard
            label='Total Bookings'
            value={stats?.totalBookings ?? 0}
            icon={<Ticket className='size-6 text-blue-600' />}
            colorClass='bg-blue-50/60'
          />
          <StatCard
            label='Pending'
            value={stats?.pendingBookings ?? 0}
            icon={<Clock className='size-6 text-yellow-600' />}
            colorClass='bg-yellow-50/60'
          />
          <StatCard
            label='Confirmed'
            value={stats?.confirmedBookings ?? 0}
            icon={<CheckCircle2 className='size-6 text-green-600' />}
            colorClass='bg-green-50/60'
          />
          <StatCard
            label='Cancelled'
            value={stats?.cancelledBookings ?? 0}
            icon={<XCircle className='size-6 text-red-600' />}
            colorClass='bg-red-50/60'
          />
          <StatCard
            label='Unverified Payments'
            value={stats?.unverifiedPayments ?? 0}
            icon={<AlertCircle className='size-6 text-orange-600' />}
            colorClass='bg-orange-50/60'
          />
          <StatCard
            label='Total Revenue'
            value={formatAmount(stats?.totalRevenuePaise ?? 0)}
            icon={<IndianRupee className='size-6 text-purple-600' />}
            colorClass='bg-purple-50/60'
          />
          <StatCard
            label='Total Users'
            value={stats?.totalUsers ?? 0}
            icon={<Users className='size-6 text-slate-600' />}
            colorClass='bg-slate-50/60'
          />
        </div>
      )}

      {/* ── Place Performance ──────────────────────────────────────────────── */}
      <div className='border rounded-lg overflow-hidden'>
        <div className='px-6 py-4 border-b'>
          <h2 className='text-lg font-medium'>Place Performance</h2>
          <p className='text-sm text-muted-foreground'>
            Booking statistics grouped by destination
          </p>
        </div>

        {placeStatsLoading ? (
          <div className='p-6'>
            <TableSkeleton rows={5} cols={8} />
          </div>
        ) : !placeStats?.length ? (
          <div className='px-6 py-10 text-center text-muted-foreground text-sm'>
            No place data yet.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/40'>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Place
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Type
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    City / State
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Total Bookings
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Confirmed
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Pending
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Members
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {placeStats.map((ps, i) => (
                  <tr
                    key={ps.placeSlug}
                    className={i % 2 === 0 ? 'bg-background' : 'bg-accent/20'}
                  >
                    <td className='px-4 py-3 font-medium'>{ps.placeName}</td>
                    <td className='px-4 py-3'>
                      <Badge
                        className={
                          ps.destinationType === 'monument'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }
                      >
                        {ps.destinationType}
                      </Badge>
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>
                      {ps.city}, {ps.state}
                    </td>
                    <td className='px-4 py-3 text-right'>{ps.totalBookings}</td>
                    <td className='px-4 py-3 text-right text-green-700'>
                      {ps.confirmedBookings}
                    </td>
                    <td className='px-4 py-3 text-right text-yellow-700'>
                      {ps.pendingBookings}
                    </td>
                    <td className='px-4 py-3 text-right'>{ps.totalMembers}</td>
                    <td className='px-4 py-3 text-right font-medium'>
                      {formatAmount(ps.totalRevenuePaise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Recent Bookings ────────────────────────────────────────────────── */}
      <div className='border rounded-lg overflow-hidden'>
        <div className='px-6 py-4 border-b flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-medium'>Recent Bookings</h2>
            <p className='text-sm text-muted-foreground'>
              Last 10 bookings across all places
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link href={'/admin/bookings' as never}>
              View All
              <ArrowRight className='size-4 ml-1' />
            </Link>
          </Button>
        </div>

        {bookingsLoading ? (
          <div className='p-6'>
            <TableSkeleton rows={8} cols={8} />
          </div>
        ) : !recentBookings?.length ? (
          <div className='px-6 py-10 text-center text-muted-foreground text-sm'>
            No bookings yet.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/40'>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    User
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Place
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Visit Date
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Members
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Amount
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Status
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Payment
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, i) => (
                  <tr
                    key={b.id}
                    className={i % 2 === 0 ? 'bg-background' : 'bg-accent/20'}
                  >
                    <td className='px-4 py-3'>
                      <div className='font-medium'>
                        {b.userName ?? 'Unknown'}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {b.userEmail}
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{b.placeName}</div>
                      <div className='text-xs text-muted-foreground'>
                        {b.city}, {b.state}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>
                      {formatDate(b.visitDate)}
                    </td>
                    <td className='px-4 py-3 text-right'>{b.totalMembers}</td>
                    <td className='px-4 py-3 text-right font-medium'>
                      {formatAmount(b.totalAmount)}
                    </td>
                    <td className='px-4 py-3'>
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className='px-4 py-3'>
                      <PaymentStatusBadge status={b.paymentStatus} />
                    </td>
                    <td className='px-4 py-3'>
                      <Button variant='outline' size='sm' asChild>
                        <Link
                          href={`/tickets/confirmation/${b.id}`}
                          target='_blank'
                        >
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </AdminGuard>
  );
}
