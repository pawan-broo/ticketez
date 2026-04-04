'use client';

import { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { AdminGuard } from '@/app/(admin)/_components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// ─── Chart Configs ────────────────────────────────────────────────────────────

const bookingChartConfig = {
  total: { label: 'Total', color: 'hsl(217, 91%, 60%)' },
  confirmed: { label: 'Confirmed', color: 'hsl(142, 71%, 45%)' },
  pending: { label: 'Pending', color: 'hsl(45, 93%, 47%)' },
  cancelled: { label: 'Cancelled', color: 'hsl(0, 84%, 60%)' },
  unverifiedPayment: { label: 'Unverified Payment', color: 'hsl(25, 95%, 53%)' },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: { label: 'Revenue (₹)', color: 'hsl(262, 83%, 58%)' },
} satisfies ChartConfig;

const PLACE_COLORS = [
  'hsl(217, 91%, 60%)',
  'hsl(142, 71%, 45%)',
  'hsl(25, 95%, 53%)',
  'hsl(0, 84%, 60%)',
  'hsl(262, 83%, 58%)',
  'hsl(180, 60%, 45%)',
  'hsl(300, 60%, 50%)',
  'hsl(45, 93%, 47%)',
];

// ─── Month/Year Picker ────────────────────────────────────────────────────────

function MonthYearPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
}: {
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
}) {
  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const YEARS = [2024, 2025, 2026];
  const selectCls =
    'border rounded-md px-2 py-1 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <div className='flex items-center gap-2'>
      <select
        className={selectCls}
        value={month}
        onChange={(e) => onMonthChange(Number(e.target.value))}
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
      <select
        className={selectCls}
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const now = new Date();

  const [bookingMonth, setBookingMonth] = useState(now.getMonth() + 1);
  const [bookingYear, setBookingYear] = useState(now.getFullYear());

  const [revenueMonth, setRevenueMonth] = useState(now.getMonth() + 1);
  const [revenueYear, setRevenueYear] = useState(now.getFullYear());

  const [placeMonth, setPlaceMonth] = useState(now.getMonth() + 1);
  const [placeYear, setPlaceYear] = useState(now.getFullYear());

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: bookingData, isLoading: bookingLoading } =
    trpc.admin.getBookingChartData.useQuery({
      month: bookingMonth,
      year: bookingYear,
    });

  const { data: revenueData, isLoading: revenueLoading } =
    trpc.admin.getRevenueChartData.useQuery({
      month: revenueMonth,
      year: revenueYear,
    });

  const { data: placeData, isLoading: placeLoading } =
    trpc.admin.getPlacePerformanceChartData.useQuery({
      month: placeMonth,
      year: placeYear,
    });

  // ── Data Transforms ────────────────────────────────────────────────────────

  const bookingChartData = useMemo(() => {
    if (!bookingData) return [];
    return bookingData.map((d) => ({
      ...d,
      label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
    }));
  }, [bookingData]);

  const revenueChartData = useMemo(() => {
    if (!revenueData) return [];
    return revenueData.map((d) => ({
      ...d,
      revenue: d.revenue / 100,
      label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      }),
    }));
  }, [revenueData]);

  const totalRevenuePaise = useMemo(
    () => revenueData?.reduce((sum, d) => sum + d.revenue, 0) ?? 0,
    [revenueData],
  );

  const { pivoted, placeNames } = useMemo(() => {
    if (!placeData) return { pivoted: [], placeNames: [] };

    const dateMap = new Map<string, Record<string, number>>();
    const names = new Set<string>();

    for (const row of placeData) {
      names.add(row.placeName);
      const existing = dateMap.get(row.date) ?? {};
      dateMap.set(row.date, { ...existing, [row.placeName]: row.bookings });
    }

    const pivotedArr = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({
        date,
        label: new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
        }),
        ...vals,
      }));

    return { pivoted: pivotedArr, placeNames: Array.from(names) };
  }, [placeData]);

  const placeChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    placeNames.forEach((name, i) => {
      config[name] = {
        label: name,
        color: PLACE_COLORS[i % PLACE_COLORS.length],
      };
    });
    return config;
  }, [placeNames]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AdminGuard>
      <div className='container border-x min-h-full px-4 py-10 sm:px-8 sm:py-16 md:px-12 md:py-[80px] space-y-8'>

        {/* Page header */}
        <div>
          <h1 className='text-3xl font-medium text-primary'>Analytics</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Charts and trends for bookings, revenue, and place performance
          </p>
        </div>

        {/* Tableau Banner */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border bg-accent/30 px-5 py-4'>
          <div className='flex items-center gap-3'>
            <ExternalLink className='size-5 text-muted-foreground shrink-0' />
            <div>
              <p className='font-medium text-sm'>View analytics on Tableau Dashboard</p>
              <p className='text-xs text-muted-foreground'>Deeper insights and visualisations</p>
            </div>
          </div>
          <Button size='sm' variant='outline' asChild>
            <a
              href='https://public.tableau.com/shared/6S8W9MMG6?:display_count=n&:origin=viz_share_link'
              target='_blank'
              rel='noopener noreferrer'
            >
              View on Tableau
              <ExternalLink className='size-3.5 ml-1' />
            </a>
          </Button>
        </div>

        {/* ── Section 1: Bookings Overview ──────────────────────────────────── */}
        <div className='border rounded-lg overflow-hidden'>
          <div className='px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div>
              <h2 className='text-lg font-medium'>Bookings Overview</h2>
              <p className='text-sm text-muted-foreground'>
                Daily booking counts by status
              </p>
            </div>
            <MonthYearPicker
              month={bookingMonth}
              year={bookingYear}
              onMonthChange={setBookingMonth}
              onYearChange={setBookingYear}
            />
          </div>
          <div className='p-6'>
            {bookingLoading ? (
              <Skeleton className='h-[300px] w-full rounded' />
            ) : !bookingChartData.length ? (
              <p className='text-muted-foreground text-sm text-center py-16'>
                No data for this period.
              </p>
            ) : (
              <ChartContainer config={bookingChartConfig} className='h-[300px] w-full'>
                <AreaChart data={bookingChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    {(
                      Object.entries(bookingChartConfig) as [
                        keyof typeof bookingChartConfig,
                        (typeof bookingChartConfig)[keyof typeof bookingChartConfig],
                      ][]
                    ).map(([key, cfg]) => (
                      <linearGradient
                        key={key}
                        id={`fill-booking-${key}`}
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop offset='5%' stopColor={cfg.color} stopOpacity={0.3} />
                        <stop offset='95%' stopColor={cfg.color} stopOpacity={0.0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    interval='preserveStartEnd'
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    width={32}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type='monotone'
                    dataKey='total'
                    stroke={bookingChartConfig.total.color}
                    fill={`url(#fill-booking-total)`}
                    strokeWidth={2}
                    fillOpacity={0.15}
                    dot={false}
                  />
                  <Area
                    type='monotone'
                    dataKey='confirmed'
                    stroke={bookingChartConfig.confirmed.color}
                    fill={`url(#fill-booking-confirmed)`}
                    strokeWidth={2}
                    fillOpacity={0.15}
                    dot={false}
                  />
                  <Area
                    type='monotone'
                    dataKey='pending'
                    stroke={bookingChartConfig.pending.color}
                    fill={`url(#fill-booking-pending)`}
                    strokeWidth={2}
                    fillOpacity={0.15}
                    dot={false}
                  />
                  <Area
                    type='monotone'
                    dataKey='cancelled'
                    stroke={bookingChartConfig.cancelled.color}
                    fill={`url(#fill-booking-cancelled)`}
                    strokeWidth={2}
                    fillOpacity={0.15}
                    dot={false}
                  />
                  <Area
                    type='monotone'
                    dataKey='unverifiedPayment'
                    stroke={bookingChartConfig.unverifiedPayment.color}
                    fill={`url(#fill-booking-unverifiedPayment)`}
                    strokeWidth={2}
                    fillOpacity={0.15}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </div>

        {/* ── Section 2: Revenue ────────────────────────────────────────────── */}
        <div className='border rounded-lg overflow-hidden'>
          <div className='px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div>
              <h2 className='text-lg font-medium'>Revenue</h2>
              <p className='text-sm text-muted-foreground'>
                Daily revenue collected
              </p>
            </div>
            <MonthYearPicker
              month={revenueMonth}
              year={revenueYear}
              onMonthChange={setRevenueMonth}
              onYearChange={setRevenueYear}
            />
          </div>
          <div className='p-6 space-y-4'>
            {revenueLoading ? (
              <Skeleton className='h-[300px] w-full rounded' />
            ) : !revenueChartData.length ? (
              <p className='text-muted-foreground text-sm text-center py-16'>
                No data for this period.
              </p>
            ) : (
              <>
                <div className='flex items-baseline gap-2'>
                  <span className='text-2xl font-semibold text-purple-600'>
                    ₹{(totalRevenuePaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className='text-sm text-muted-foreground'>total this period</span>
                </div>
                <ChartContainer config={revenueChartConfig} className='h-[300px] w-full'>
                  <BarChart
                    data={revenueChartData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                      dataKey='label'
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      interval='preserveStartEnd'
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
                      width={52}
                      tickFormatter={(v: number) =>
                        v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                      }
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [
                            `₹${Number(value).toLocaleString('en-IN')}`,
                            'Revenue',
                          ]}
                        />
                      }
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey='revenue'
                      fill={revenueChartConfig.revenue.color}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </>
            )}
          </div>
        </div>

        {/* ── Section 3: Place Performance ──────────────────────────────────── */}
        <div className='border rounded-lg overflow-hidden'>
          <div className='px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div>
              <h2 className='text-lg font-medium'>Place Performance</h2>
              <p className='text-sm text-muted-foreground'>
                Daily bookings per place
              </p>
            </div>
            <MonthYearPicker
              month={placeMonth}
              year={placeYear}
              onMonthChange={setPlaceMonth}
              onYearChange={setPlaceYear}
            />
          </div>
          <div className='p-6'>
            {placeLoading ? (
              <Skeleton className='h-[300px] w-full rounded' />
            ) : !pivoted.length ? (
              <p className='text-muted-foreground text-sm text-center py-16'>
                No data for this period.
              </p>
            ) : (
              <ChartContainer config={placeChartConfig} className='h-[300px] w-full'>
                <AreaChart
                  data={pivoted}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    {placeNames.map((name, i) => (
                      <linearGradient
                        key={name}
                        id={`fill-place-${i}`}
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor={PLACE_COLORS[i % PLACE_COLORS.length]}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset='95%'
                          stopColor={PLACE_COLORS[i % PLACE_COLORS.length]}
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />
                  <XAxis
                    dataKey='label'
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    interval='preserveStartEnd'
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    width={32}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {placeNames.map((name, i) => (
                    <Area
                      key={name}
                      type='monotone'
                      dataKey={name}
                      stroke={PLACE_COLORS[i % PLACE_COLORS.length]}
                      fill={`url(#fill-place-${i})`}
                      strokeWidth={2}
                      fillOpacity={0.1}
                      dot={false}
                    />
                  ))}
                </AreaChart>
              </ChartContainer>
            )}
          </div>
        </div>

      </div>
    </AdminGuard>
  );
}
