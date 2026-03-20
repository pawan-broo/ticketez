'use client';

import React, { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookingDialog } from '@/components/feature';
import { MapPin, Navigation, Search, AlertCircle } from 'lucide-react';

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
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('nearest');
  const [stateFilter, setStateFilter] = useState<string>('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      () => {
        setLocationError('Location access denied. Showing all places.');
        setLocationLoading(false);
      },
    );
  }, []);

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

  const allQuery = trpc.places.getAll.useQuery(
    {
      type: typeFilter,
      search: searchQuery || undefined,
      state: stateFilter || undefined,
    },
    { enabled: !userCoords },
  );

  const allPlacesForFilter = trpc.places.getAll.useQuery(
    { limit: 200 },
    { staleTime: 60000 },
  );
  const availableStates = Array.from(
    new Set((allPlacesForFilter.data ?? []).map((p) => p.state)),
  ).sort();

  const places = userCoords ? nearbyQuery.data : allQuery.data;
  const isLoading =
    locationLoading ||
    (userCoords ? nearbyQuery.isLoading : allQuery.isLoading);

  const enriched = (places ?? [] as Place[]).map((p: Place) => ({
    ...p,
    distanceKm:
      userCoords && p.latitude != null && p.longitude != null
        ? haversineKm(userCoords.lat, userCoords.lng, p.latitude, p.longitude)
        : null,
  }));

  const sorted = [...enriched].sort((a, b) => {
    if (
      sortBy === 'nearest' &&
      a.distanceKm != null &&
      b.distanceKm != null
    ) {
      return a.distanceKm - b.distanceKm;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b '>
      <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
        {/* Page Header */}
        <div>
          <h1 className='text-3xl font-bold'>Places Near Me</h1>
          <p className='text-muted-foreground mt-2'>
            Discover monuments and museums around you
          </p>
        </div>

        {/* Location Banner */}
        {locationLoading && (
          <div className='flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300'>
            <Navigation className='size-4 shrink-0 animate-pulse' />
            <span>Detecting your location...</span>
          </div>
        )}

        {!locationLoading && locationError && (
          <div className='flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'>
            <AlertCircle className='size-4 shrink-0' />
            <span>{locationError}</span>
          </div>
        )}

        {!locationLoading && userCoords && (
          <div className='flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300'>
            <MapPin className='size-4 shrink-0' />
            <span>
              📍 Showing places sorted by distance from your location
            </span>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
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
                {t === 'all'
                  ? 'All'
                  : t === 'monument'
                    ? 'Monuments'
                    : 'Museums'}
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
          <div className='grid grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='border rounded-xl overflow-hidden animate-pulse'
              >
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
          <div className='grid grid-cols-4 gap-6'>
            {sorted.map((place) => (
              <div
                key={place.id}
                className='border rounded-xl p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'
              >
                {/* Image placeholder */}
                <div className='h-[180px] bg-primary/10 flex items-center justify-center'>
                  <span className='text-5xl'>
                    {place.type === 'monument' ? '🏛️' : '🖼️'}
                  </span>
                </div>

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

                  {/* Book Tickets — stop propagation so card click doesn't fire */}
                  <div
                    className='mt-1'
                    onClick={(e) => e.stopPropagation()}
                  >
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
