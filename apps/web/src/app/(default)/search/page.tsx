import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Database } from '@/constants/database';
import { slugToString } from '@/utils';
import {
  ArrowUpRight,
  Bookmark,
  Upload,
  MapPin,
  BadgePercent,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import type { Route } from 'next';
import { HeroSearchBar } from '@/components/feature';
import { BookingDialog } from '@/components/feature/BookingDialog';

interface SearchPageProps {
  searchParams: Promise<{
    country?: string;
    state?: string;
    city?: string;
    lookFor?: string;
    destinationType?: string;
  }>;
}

const Search: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const params = await searchParams;
  const { country, state, city, lookFor, destinationType } = params;

  // Find the matching data in database
  const findPlace = () => {
    if (!country || !state || !city || !lookFor) return null;

    const countryData = Database.find(
      (c) => c.country.toLowerCase() === country.toLowerCase(),
    );
    if (!countryData) return null;

    const stateData = countryData.states.find(
      (s) => s.state.toLowerCase() === state.toLowerCase(),
    );
    if (!stateData) return null;

    const cityData = stateData.city.find(
      (c) => c.city.toLowerCase() === city.toLowerCase(),
    );
    if (!cityData) return null;

    let placeData = null;

    placeData = cityData.monuments.find((data) => data.slug === lookFor);
    if (placeData) return placeData;

    placeData = cityData.museums.find((data) => data.slug === lookFor);
    return placeData;
  };

  const placeData = findPlace();

  // Empty/Not Found State
  if (!placeData) {
    return (
      <div className='flex w-full flex-col items-center justify-center border-b '>
        <div className='container flex flex-col items-center gap-2 border-x h-full py-[200px] px-12'>
          <h1 className='text-2xl font-semibold'>No Results Found</h1>
          <p className='text-muted-foreground text-center'>
            We couldn't find any info here. Try searching for a different
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
        <div className='container flex flex-col gap-5 border-x h-full py-[140px] px-12'>
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
            <section className='w-full flex justify-between'>
              <section className='leading-tight'>
                <h1 className='text-2xl font-semibold'>{placeData.name}</h1>
                <p className='text-muted-foreground mt-1 flex items-center gap-2 leading-none'>
                  <MapPin className='w-4 to-muted-foreground' />{' '}
                  <span>
                    {placeData.location} &bull;{' '}
                    <Link
                      href={placeData.googleMapLink as Route}
                      target='_blank'
                      className='underline underline-offset-2'
                    >
                      Open in Google Map
                    </Link>
                  </span>
                </p>
              </section>

              <section className='gap-2 flex'>
                <Button variant='outline' size='sm'>
                  <Bookmark /> Save
                </Button>
                <Button variant='outline' size='sm'>
                  <Upload /> Share
                </Button>
                <BookingDialog
                  placeSlug={placeData.slug}
                  placeName={placeData.name}
                  placeLocation={placeData.location}
                  destinationType={destinationType as 'monument' | 'museum'}
                  country={country || ''}
                  state={state || ''}
                  city={city || ''}
                />
              </section>
            </section>

            <div className='grid grid-cols-2 gap-12'>
              <div className='grid grid-cols-3 gap-1 h-fit'>
                {placeData.images.map((_, index) => (
                  <div
                    key={index}
                    className='w-full h-[150px] rounded-xl bg-primary/40'
                  />
                ))}
                {placeData.videos.map((_, index) => (
                  <div
                    key={index}
                    className='w-full h-[150px] rounded-xl bg-primary/40'
                  />
                ))}
              </div>

              <div className='flex flex-col gap-8'>
                <section className='py-3 px-5 text-sm bg-primary items-center text-secondary  flex justify-between cursor-pointer rounded-lg hover:no-underline'>
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
                      <p className='text-muted-foreground gap-2 text-sm font-medium  leading-none flex items-center'>
                        <span className='mt-0.5'>[</span>
                        <span>Useful Information</span>
                        <span className='mt-0.5'>]</span>
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className='px-5 pt-4'>
                      <div className='grid grid-cols-2 gap-3'>
                        {placeData.metadata.map((meta, index) => (
                          <div key={index} className='flex flex-col'>
                            <p className='text-sm text-muted-foreground'>
                              {meta.label}
                            </p>
                            <p className=' font-medium'>{meta.data}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* About Section */}
                  <AccordionItem value='about' className='border-none mt-2'>
                    <AccordionTrigger className='py-3 px-5 bg-accent/60 rounded-lg hover:no-underline'>
                      <p className='text-muted-foreground gap-2 text-sm font-medium  leading-none flex items-center'>
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
                      <p className='text-muted-foreground gap-2 text-sm font-medium  leading-none flex items-center'>
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

      {(() => {
        // Find the matching country
        const countryData = Database.find(
          (c) =>
            c.country.toLowerCase() ===
            slugToString(country ?? '').toLowerCase(),
        );

        if (!countryData) return null;

        // Find the matching state
        const stateData = countryData.states.find(
          (s) =>
            s.state.toLowerCase() === slugToString(state ?? '').toLowerCase(),
        );

        if (!stateData) return null;

        // Find the matching city
        const cityData = stateData.city.find(
          (c) =>
            c.city.toLowerCase() === slugToString(city ?? '').toLowerCase(),
        );

        if (!cityData) return null;

        // Combine monuments and museums
        const allPlaces = [
          ...[
            ...cityData.monuments.map((m) => ({ ...m, type: 'Monument' })),
            ...cityData.museums.map((m) => ({ ...m, type: 'Museum' })),
          ].filter((p) => p.slug !== lookFor),
        ];

        if (allPlaces.length === 0) {
          return (
            <p className='text-muted-foreground'>
              No similar places found in this city.
            </p>
          );
        }

        return (
          <div className='flex w-full flex-col items-center justify-center border-b '>
            <div className='container flex flex-col items-center gap-8 border-x h-full py-[80px] px-12'>
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
                <section className='grid grid-cols-2 gap-3'>
                  {allPlaces.map((place, index) => (
                    <div
                      key={index}
                      className='w-[400px] p-1 rounded-xl border flex gap-2'
                    >
                      <div className='size-[80px] bg-primary/40 rounded-lg' />
                      <div className='p-0.5 leading-tight'>
                        <h1 className='font-medium'>{place.name}</h1>
                        <p className='text-sm text-muted-foreground'>
                          1.05 km from {lookFor && slugToString(lookFor)}
                        </p>
                        {/* <p className='text-sm text-muted-foreground'>
                          {place.location}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          <Link href=''>Open on Google Map</Link>
                        </p> */}
                      </div>
                    </div>
                  ))}
                </section>
              </section>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default Search;
