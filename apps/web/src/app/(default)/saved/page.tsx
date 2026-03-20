'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Bookmark, BookmarkX, ArrowUpRight } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const SavedPlacesPage: React.FC = () => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const {
    data: savedPlaces,
    isLoading,
    refetch,
  } = trpc.savedPlaces.getAll.useQuery(undefined, {
    enabled: !!session,
  });

  const unsaveMutation = trpc.savedPlaces.unsave.useMutation({
    onSuccess: () => {
      toast.success('Removed from saved places');
      refetch();
    },
    onError: () => {
      toast.error('Failed to remove. Please try again.');
    },
  });

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push('/login');
    }
  }, [session, sessionPending, router]);

  if (sessionPending || (!session && !sessionPending)) {
    return (
      <div className='flex w-full items-center justify-center min-h-screen'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b '>
      <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold flex items-center gap-3'>
              <Bookmark className='size-7' />
              Saved Places
            </h1>
            <p className='text-muted-foreground mt-2'>
              Places you&apos;ve bookmarked for later
            </p>
          </div>
          <Button variant='outline' onClick={() => router.push('/places')}>
            Browse More Places
            <ArrowUpRight className='size-4 ml-1' />
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='border rounded-lg p-3 flex flex-col gap-2'>
                <Skeleton className='w-full h-[200px] rounded-lg' />
                <Skeleton className='h-4 w-3/4 rounded' />
                <Skeleton className='h-3 w-1/2 rounded' />
                <Skeleton className='h-8 w-full rounded' />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!savedPlaces || savedPlaces.length === 0) && (
          <div className='flex flex-col items-center justify-center py-24 gap-5'>
            <Bookmark className='size-16 text-muted-foreground/40' />
            <div className='flex flex-col items-center gap-1'>
              <p className='text-lg font-semibold'>No saved places yet</p>
              <p className='text-sm text-muted-foreground text-center max-w-sm'>
                When you find a place you like, click the{' '}
                <Bookmark className='inline size-4 mb-0.5' /> Save button on the
                place page to bookmark it here.
              </p>
            </div>
            <Button onClick={() => router.push('/places')}>
              Explore Destinations
              <ArrowUpRight className='size-4 ml-1' />
            </Button>
          </div>
        )}

        {/* Grid */}
        {!isLoading && savedPlaces && savedPlaces.length > 0 && (
          <>
            <p className='text-sm text-muted-foreground -mt-2'>
              {savedPlaces.length} saved{' '}
              {savedPlaces.length === 1 ? 'place' : 'places'}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {savedPlaces.map((place) => {
                const searchUrl = `/search?country=${encodeURIComponent(
                  place.country.toLowerCase(),
                )}&state=${encodeURIComponent(
                  place.state.toLowerCase(),
                )}&city=${encodeURIComponent(
                  place.city.toLowerCase(),
                )}&lookFor=${place.placeSlug}&destinationType=${place.destinationType}`;

                return (
                  <div
                    key={place.id}
                    className='border rounded-lg p-3 flex flex-col gap-2 hover:shadow-lg transition-shadow group'
                  >
                    {/* Image placeholder */}
                    <div
                      className='w-full h-[200px] bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer'
                      onClick={() => router.push(searchUrl as never)}
                    >
                      <span className='text-5xl'>
                        {place.destinationType === 'monument' ? '🏛️' : '🖼️'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className='px-1 flex flex-col gap-1.5'>
                      {/* Type badge */}
                      <Badge
                        className={`self-start text-xs font-medium ${
                          place.destinationType === 'monument'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }`}
                      >
                        {place.destinationType === 'monument'
                          ? 'Monument'
                          : 'Museum'}
                      </Badge>

                      <h3
                        className='font-semibold text-md leading-tight cursor-pointer hover:underline underline-offset-2'
                        onClick={() => router.push(searchUrl as never)}
                      >
                        {place.placeName}
                      </h3>

                      <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                        <MapPin className='size-3.5 shrink-0' />
                        <p className='line-clamp-1'>{place.placeLocation}</p>
                      </div>

                      <p className='text-xs text-muted-foreground'>
                        Saved{' '}
                        {new Date(place.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2 mt-1 px-1'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1'
                        onClick={() => router.push(searchUrl as never)}
                      >
                        View Details
                        <ArrowUpRight className='size-3.5 ml-1' />
                      </Button>

                      <Button
                        size='sm'
                        variant='ghost'
                        className='text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                        disabled={unsaveMutation.isPending}
                        onClick={() =>
                          unsaveMutation.mutate({ placeSlug: place.placeSlug })
                        }
                        title='Remove from saved'
                      >
                        <BookmarkX className='size-4' />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedPlacesPage;
