'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookingDialog } from '@/components/feature';
import { MapPin, Navigation, Search, AlertCircle, LocateFixed } from 'lucide-react';
import Image from 'next/image';

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type TypeFilter = 'all' | 'monument' | 'museum';
type SortBy = 'nearest' | 'name';
type LocationStatus = 'loading' | 'granted' | 'denied' | 'unavailable' | 'unsupported';

interface Place {
  id: string;
  name: string;
  slug: string;
  type: string;
  country: string;
  state: string;
  city: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  googleMapLink: string | null;
  images: string[];
  videos: string[];
  shortDesc: string | null;
  longDesc: string | null;
  precautionAndSafety: string[];
  metadata: { label: string; data: string }[] | null;
  ticketPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PlacesPage: React.FC = () => {
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('loading');
  const [locationMessage, setLocationMessage] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('nearest');
  const [stateFilter, setStateFilter] = useState<string>('');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('loading');
    setLocationMessage('');
    setUserCoords(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('granted');
        setLocationMessage('');
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
          setLocationMessage(
            'Location access was denied. Grant access to see places nearest to you.',
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationStatus('denied');
          setLocationMessage('Location request timed out. Please try again.');
        } else {
          setLocationStatus('unavailable');
          setLocationMessage('Unable to determine your location. Showing all places.');
        }
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: false },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Always fetch all places — used as the fallback (also pre-loads while GPS is pending)
  const allQuery = trpc.places.getAll.useQuery(
    {
      type: typeFilter,
      search: searchQuery || undefined,
      state: stateFilter || undefined,
    },
    { staleTime: 30000 },
  );

  // Fetch nearby only when we have coordinates
  const nearbyQuery = trpc.places.getNearby.useQuery(
    {
      lat: userCoords?.lat ?? 0,
      lng: userCoords?.lng ?? 0,
      type: typeFilter,
      search: searchQuery || undefined,
      state: stateFilter || undefined,
    },
    { enabled: !!userCoords },
  );

  const allPlacesForFilter = trpc.places.getAll.useQuery(
    { limit: 200 },
    { staleTime: 60000 },
  );
  const availableStates = Array.from(
    new Set((allPlacesForFilter.data ?? []).map((p) => p.state)),
  ).sort();

  // Use nearby results when coords are ready; fall back to all places otherwise
  const places = userCoords ? (nearbyQuery.data ?? allQuery.data) : allQuery.data;

  // Show skeleton only until we have the first batch of data — don't block on GPS
  const isLoading = userCoords
    ? nearbyQuery.isLoading && !allQuery.data
    : allQuery.isLoading;

  const enriched = (places ?? [] as Place[]).map((p: Place) => ({
    ...p,
    distanceKm:
      userCoords && p.latitude != null && p.longitude != null
        ? haversineKm(userCoords.lat, userCoords.lng, p.latitude, p.longitude)
        : null,
  }));

  const sorted = [...enriched].sort((a, b) => {
    if (sortBy === 'nearest' && a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b'>
      <div className='container flex flex-col gap-8 border-x h-full py-10 px-4 sm:py-16 sm:px-8 md:py-[80px] md:px-12'>

        {/* Page Header */}
        <div>
          <h1 className='text-3xl font-bold'>Places Near Me</h1>
          <p className='text-muted-foreground mt-2'>
            Discover monuments and museums around you
          </p>
        </div>

        {/* Location Banners */}
        {locationStatus === 'loading' && (
          <div className='flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'>
            <Navigation className='size-4 shrink-0 animate-pulse' />
            <span>Detecting your location…</span>
          </div>
        )}

        {locationStatus === 'granted' && (
          <div className='flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300'>
            <MapPin className='size-4 shrink-0' />
            <span>📍 Showing places sorted by distance from your location</span>
          </div>
        )}

        {(locationStatus === 'denied' || locationStatus === 'unavailable') && (
          <div className='flex flex-col sm:flex-row sm:items-center gap-3 ...'>
            <div className='flex items-start gap-3 flex-1'>
              <AlertCircle className='size-4 shrink-0 mt-0.5' />
              <span>{locationMessage}</span>
            </div>
            {/* Show retry button for denied AND unavailable — remove the inner conditional */}
            <Button
              size='sm'
              variant='outline'
              className='shrink-0 border-amber-400 ...'
              onClick={requestLocation}
            >
              <LocateFixed className='size-3.5' />
              {locationStatus === 'denied' ? 'Grant Location Access' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Filter Bar */}
        <div className='flex flex-wrap items-center gap-3'>
          {/* Search */}
          <div className='relative flex-1 min-w-[200px]'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
            <Input
              placeholder='Search places, cities...'
              className='pl-9'
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className='border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0'
          >
            <option value=''>All States</option>
            {availableStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Type Tabs */}
          <div className='flex items-center border rounded-lg overflow-hidden shrink-0'>
            {(['all', 'monument', 'museum'] as TypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  typeFilter === t
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {t === 'all' ? 'All' : t === 'monument' ? 'Monuments' : 'Museums'}
              </button>
            ))}
          </div>

          {/* Sort — only shown when coords are available */}
          {userCoords && (
            <div className='flex items-center border rounded-lg overflow-hidden shrink-0'>
              {(['nearest', 'name'] as SortBy[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    sortBy === s
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {s === 'nearest' ? 'Nearest First' : 'Name A–Z'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='border rounded-xl overflow-hidden animate-pulse'>
                <div className='h-[180px] bg-muted' />
                <div className='p-4 flex flex-col gap-3'>
                  <div className='h-3 bg-muted rounded-full w-1/4' />
                  <div className='h-4 bg-muted rounded w-3/4' />
                  <div className='h-3 bg-muted rounded w-1/2' />
                  <div className='h-3 bg-muted rounded w-1/3' />
                  <div className='h-8 bg-muted rounded w-full mt-1' />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && sorted.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {sorted.map((place) => (
              <div
                key={place.id}
                className='border rounded-xl p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
              >
                {/* Image */}
                {place.images[0] ? (
                  <div className='h-[180px] bg-primary/10 relative'>
                    <Image
                      src={place.images[0]!}
                      blurDataURL=''
                      alt={place.name}
                      fill
                      unoptimized
                      className='object-cover object-top'
                    />
                  </div>
                ) : (
                  <div className='h-[180px] bg-primary/10' />
                )}

                {/* Content */}
                <div className='p-4 flex flex-col gap-2'>
                  {/* Type badge */}
                  <span
                    className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      place.type === 'monument'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {place.type === 'monument' ? 'Monument' : 'Museum'}
                  </span>

                  {/* Name */}
                  <h3 className='font-semibold text-lg leading-tight line-clamp-2'>
                    {place.name}
                  </h3>

                  {/* City + State */}
                  <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                    <MapPin className='size-3.5 shrink-0' />
                    <span className='line-clamp-1'>
                      {place.city}, {place.state}
                    </span>
                  </div>

                  {/* Distance */}
                  {place.distanceKm != null && (
                    <p className='text-sm text-primary font-medium'>
                      ~{place.distanceKm.toFixed(0)} km away
                    </p>
                  )}

                  {/* Ticket price */}
                  <p className='text-sm text-muted-foreground'>
                    {place.ticketPrice === 0
                      ? 'Free entry'
                      : `₹${place.ticketPrice / 100} per person`}
                  </p>

                  {/* Book Tickets */}
                  <div className='mt-1' onClick={(e) => e.stopPropagation()}>
                    <BookingDialog
                      placeSlug={place.slug}
                      placeName={place.name}
                      placeLocation={place.location}
                      destinationType={place.type as 'monument' | 'museum'}
                      country={place.country}
                      state={place.state}
                      city={place.city}
                      ticketPrice={place.ticketPrice}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sorted.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 gap-4'>
            <span className='text-5xl'>🏛️</span>
            <p className='text-lg font-semibold'>No places found</p>
            <p className='text-muted-foreground text-sm text-center max-w-sm'>
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term or clear the filters.`
                : 'No places are available for the selected filters.'}
            </p>
            {(searchQuery || typeFilter !== 'all' || stateFilter !== '') && (
              <Button
                variant='outline'
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setStateFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesPage;
