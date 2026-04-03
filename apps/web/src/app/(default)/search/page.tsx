'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { slugToString } from '@/utils';
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Upload,
  MapPin,
  BadgePercent,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import type { Route } from 'next';
import { HeroSearchBar } from '@/components/feature';
import { BookingDialog } from '@/components/feature/BookingDialog';
import { trpc } from '@/utils/trpc';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Image from 'next/image';

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lookFor = searchParams.get('lookFor') ?? '';
  const country = searchParams.get('country') ?? '';
  const state = searchParams.get('state') ?? '';
  const city = searchParams.get('city') ?? '';

  const { data: placeData, isLoading } = trpc.places.getBySlug.useQuery(
    { slug: lookFor },
    { enabled: !!lookFor },
  );

  const { data: similarPlaces } = trpc.places.getAll.useQuery(
    { city: city, limit: 6 },
    { enabled: !!city },
  );

  const filteredSimilar = (similarPlaces ?? [])
    .filter((p) => p.slug !== lookFor)
    .slice(0, 4);

  const { data: session } = authClient.useSession();

  const { data: isSavedData, refetch: refetchSaved } =
    trpc.savedPlaces.isSaved.useQuery(
      { placeSlug: lookFor },
      { enabled: !!session && !!lookFor },
    );

  const saveMutation = trpc.savedPlaces.save.useMutation({
    onSuccess: () => {
      toast.success('Place saved!');
      refetchSaved();
    },
  });

  const unsaveMutation = trpc.savedPlaces.unsave.useMutation({
    onSuccess: () => {
      toast.success('Removed from saved');
      refetchSaved();
    },
  });

  const handleSave = () => {
    if (!session) {
      toast.error('Please log in to save places');
      return;
    }
    if (!placeData) return;
    if (isSavedData?.saved) {
      unsaveMutation.mutate({ placeSlug: lookFor });
    } else {
      saveMutation.mutate({
        placeSlug: placeData.slug,
        placeName: placeData.name,
        placeLocation: placeData.location,
        destinationType: placeData.type as 'monument' | 'museum',
        country: placeData.country,
        state: placeData.state,
        city: placeData.city,
        placeId: placeData.id,
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const isMutating = saveMutation.isPending || unsaveMutation.isPending;

  // Loading state
  if (isLoading) {
    return (
      <div className='flex w-full flex-col items-center justify-center border-b'>
        <div className='container flex flex-col gap-8 border-x h-full py-24 px-4 sm:py-32 sm:px-8 md:py-[140px] md:px-12 animate-pulse'>
          <div className='h-4 bg-muted rounded w-1/3' />
          <div className='flex justify-between items-start'>
            <div className='flex flex-col gap-2'>
              <div className='h-7 bg-muted rounded w-64' />
              <div className='h-4 bg-muted rounded w-48' />
            </div>
            <div className='flex gap-2'>
              <div className='h-9 bg-muted rounded w-20' />
              <div className='h-9 bg-muted rounded w-20' />
              <div className='h-9 bg-muted rounded w-28' />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-1'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='h-[150px] bg-muted rounded-xl' />
              ))}
            </div>
            <div className='flex flex-col gap-4'>
              <div className='h-12 bg-muted rounded-lg' />
              <div className='h-40 bg-muted rounded-lg' />
              <div className='h-12 bg-muted rounded-lg' />
              <div className='h-12 bg-muted rounded-lg' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!placeData) {
    return (
      <div className='flex w-full flex-col items-center justify-center border-b'>
        <div className='container flex flex-col items-center gap-2 border-x h-full py-[200px] px-12'>
          <h1 className='text-2xl font-semibold'>No Results Found</h1>
          <p className='text-muted-foreground text-center'>
            We couldn&apos;t find any info here. Try searching for a different
            keyword.
          </p>
          <p className='text-sm text-muted-foreground'>
            Looking for &nbsp;
            <Badge variant='outline' className='font-normal'>
              {lookFor && slugToString(lookFor)}
            </Badge>
          </p>
          <div className='w-[300px] bg-border h-px mt-5 mb-4' />
          <HeroSearchBar />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='flex w-full flex-col items-center justify-center border-b'>
        <div className='container flex flex-col gap-5 border-x h-full py-24 px-4 sm:py-32 sm:px-8 md:py-[140px] md:px-12'>
          <p>
            Looking results for &nbsp;
            <Badge variant='outline' className='font-normal'>
              {lookFor && slugToString(lookFor)}
            </Badge>
            &nbsp; in &nbsp;
            <Badge variant='outline' className='font-normal'>
              {city && slugToString(city)}
            </Badge>
            &nbsp;
            <Badge variant='outline' className='font-normal'>
              {state && slugToString(state)}
            </Badge>
            &nbsp;
            <Badge variant='outline' className='font-normal'>
              {country && slugToString(country)}
            </Badge>
          </p>

          <div className='flex flex-col gap-8'>
            <section className='w-full flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0'>
              <section className='leading-tight'>
                <h1 className='text-2xl font-semibold'>{placeData.name}</h1>
                <p className='text-muted-foreground mt-1 flex items-center gap-2 leading-none'>
                  <MapPin className='w-4 to-muted-foreground' />
                  <span>
                    {placeData.location}
                    {placeData.googleMapLink && (
                      <>
                        {' '}
                        &bull;{' '}
                        <Link
                          href={placeData.googleMapLink as Route}
                          target='_blank'
                          className='underline underline-offset-2'
                        >
                          Open in Google Map
                        </Link>
                      </>
                    )}
                  </span>
                </p>
              </section>

              <section className='flex flex-wrap gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleSave}
                  disabled={isMutating}
                >
                  {isMutating ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : isSavedData?.saved ? (
                    <BookmarkCheck className='w-4 h-4' />
                  ) : (
                    <Bookmark className='w-4 h-4' />
                  )}
                  {isSavedData?.saved ? 'Saved' : 'Save'}
                </Button>
                <Button variant='outline' size='sm' onClick={handleShare}>
                  <Upload /> Share
                </Button>
                <BookingDialog
                  placeSlug={placeData.slug}
                  placeName={placeData.name}
                  placeLocation={placeData.location}
                  destinationType={placeData.type as 'monument' | 'museum'}
                  country={placeData.country}
                  state={placeData.state}
                  city={placeData.city}
                  ticketPrice={placeData.ticketPrice}
                />
              </section>
            </section>




            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-1 h-fit'>
                {placeData.images.length > 0 ? (
                  <>
                    {placeData.images.map((image, index) => (
                      <div
                        key={`img-${index}`}
                        className='w-full h-[150px] re  lative rounded-xl bg-primary/40'
                      >
                        <Image
                          src={image}
                          blurDataURL=''
                          alt='image'
                          fill
                          unoptimized
                          className='object-cover object-top rounded-lg '
                        />
                      </div>
                    ))}
                </>
                ) : (
                    <>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={`vid-${index}`}
                          className='w-full h-[150px] rounded-xl bg-primary/40'
                        />
                      ))}

                  </>
                )}

              </div>

              <div className='flex flex-col gap-8'>
                <section className='py-3 px-5 text-sm bg-primary items-center text-secondary flex justify-between cursor-pointer rounded-lg hover:no-underline'>
                  <p className='flex gap-2 items-center'>
                    <BadgePercent className='w-5 text-secondary/50' />
                    Use coupon code{' '}
                    <span className='font-semibold font-mono'>
                      MY-FIRST-TICKET
                    </span>{' '}
                    for 20% discount.
                  </p>
                  <ArrowUpRight className='w-5' />
                </section>

                <Accordion type='multiple' defaultValue={['useful-info']}>
                  {/* Useful Information - Default Open */}
                  <AccordionItem value='useful-info' className='border-none'>
                    <AccordionTrigger className='py-3 px-5 bg-accent/60 rounded-lg hover:no-underline'>
                      <p className='text-muted-foreground gap-2 text-sm font-medium leading-none flex items-center'>
                        <span className='mt-0.5'>[</span>
                        <span>Useful Information</span>
                        <span className='mt-0.5'>]</span>
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className='px-5 pt-4'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {(placeData.metadata ?? []).map((meta, index) => (
                          <div key={index} className='flex flex-col'>
                            <p className='text-sm text-muted-foreground'>
                              {meta.label}
                            </p>
                            <p className='font-medium'>{meta.data}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* About Section */}
                  <AccordionItem value='about' className='border-none mt-2'>
                    <AccordionTrigger className='py-3 px-5 bg-accent/60 rounded-lg hover:no-underline'>
                      <p className='text-muted-foreground gap-2 text-sm font-medium leading-none flex items-center'>
                        <span className='mt-0.5'>[</span>
                        <span>About {placeData.name}</span>
                        <span className='mt-0.5'>]</span>
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className='px-5 pt-4 space-y-3'>
                      <p className='leading-tight'>{placeData.shortDesc}</p>
                      <p className='leading-tight'>{placeData.longDesc}</p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Precautions and Safety */}
                  <AccordionItem value='safety' className='border-none mt-2'>
                    <AccordionTrigger className='py-3 px-5 bg-accent/60 rounded-lg hover:no-underline'>
                      <p className='text-muted-foreground gap-2 text-sm font-medium leading-none flex items-center'>
                        <span className='mt-0.5'>[</span>
                        <span>Precautions and Safety</span>
                        <span className='mt-0.5'>]</span>
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className='px-5 pt-4'>
                      <ul className='space-y-2'>
                        {placeData.precautionAndSafety.map(
                          (precaution, index) => (
                            <li
                              key={index}
                              className='text-sm leading-tight flex gap-2'
                            >
                              <span className='text-primary mt-0.5'>•</span>
                              <span>{precaution}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar places */}
      {filteredSimilar.length > 0 && (
        <div className='flex w-full flex-col items-center justify-center border-b'>
          <div className='container flex flex-col items-center gap-8 border-x h-full py-10 px-4 sm:py-16 sm:px-8 md:py-[80px] md:px-12'>
            <section className='flex flex-col items-center gap-1'>
              <p className='font-medium text-xl'>Similar places to visit</p>
              <p>
                Visit similar places based on&nbsp;
                <Badge variant='outline' className='font-normal'>
                  {city && slugToString(city)}
                </Badge>
                &nbsp;
                <Badge variant='outline' className='font-normal'>
                  {state && slugToString(state)}
                </Badge>
                &nbsp;
                <Badge variant='outline' className='font-normal'>
                  {country && slugToString(country)}
                </Badge>
              </p>
            </section>

            <section className='flex justify-center w-full'>
              <section className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
                {filteredSimilar.map((place, index) => {
                  const url = `/search?country=${encodeURIComponent(place.country.toLowerCase())}&state=${encodeURIComponent(place.state.toLowerCase())}&city=${encodeURIComponent(place.city.toLowerCase())}&lookFor=${place.slug}&destinationType=${place.type}`;
                  return (
                    <div
                      key={index}
                      onClick={() => router.push(url as Route)}
                      className='w-full p-1 rounded-xl border flex gap-2 cursor-pointer hover:shadow-md transition-shadow'
                    >
                      {place.images[0] ? (
                        <div className='aspect-square w-[80px] bg-primary/40 rounded-lg shrink-0 relative' >
                          <Image
                            src={place.images[0]!}
                            blurDataURL=''
                            alt='heroImage'
                            fill
                            unoptimized
                            className='object-cover object-top  rounded-lg'
                          />
                        </div>
                      ) : (
                        <div className='aspect-square w-[80px] bg-primary/40 rounded-lg shrink-0' />
                      )}
                      <div className='p-0.5 leading-tight w-full flex flex-col gap-1'>
                        <div className='flex  items-center justify-between'>
                          <h1 className='font-medium'>{place.name}</h1>
                          <span
                            className={`self-start rounded-full px-2 py-0.5 text-xs font-medium ${
                              place.type === 'monument'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {place.type === 'monument' ? 'Monument' : 'Museum'}
                          </span>
                       </div>
                        <p className='text-sm text-muted-foreground'>
                          {place.city}, {place.state}
                        </p>
                        <p className='text-xs text-muted-foreground/70'>
                          {place.ticketPrice === 0
                            ? 'Free entry'
                            : `₹${place.ticketPrice / 100}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </section>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='flex w-full flex-col items-center justify-center border-b'>
          <div className='container flex flex-col gap-8 border-x h-full py-[140px] px-12 animate-pulse'>
            <div className='h-4 bg-muted rounded w-1/3' />
            <div className='flex justify-between items-start'>
              <div className='flex flex-col gap-2'>
                <div className='h-7 bg-muted rounded w-64' />
                <div className='h-4 bg-muted rounded w-48' />
              </div>
              <div className='flex gap-2'>
                <div className='h-9 bg-muted rounded w-20' />
                <div className='h-9 bg-muted rounded w-20' />
                <div className='h-9 bg-muted rounded w-28' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-12'>
              <div className='grid grid-cols-3 gap-1'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className='h-[150px] bg-muted rounded-xl' />
                ))}
              </div>
              <div className='flex flex-col gap-4'>
                <div className='h-12 bg-muted rounded-lg' />
                <div className='h-40 bg-muted rounded-lg' />
                <div className='h-12 bg-muted rounded-lg' />
                <div className='h-12 bg-muted rounded-lg' />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
