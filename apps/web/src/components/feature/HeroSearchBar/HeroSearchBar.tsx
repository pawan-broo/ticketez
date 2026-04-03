'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/utils/trpc';
import type { Route } from 'next';
import Image from 'next/image';

interface SearchResult {
  name: string;
  slug: string;
  type: 'Monument' | 'Museum';
  city: string;
  state: string;
  image: string | undefined;
  country: string;
  location: string;
  destinationType: string;
}

const fuzzyMatch = (text: string, query: string): number => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  if (!queryLower || !textLower) return 0;
  if (textLower === queryLower) return 1000;
  if (textLower.startsWith(queryLower)) return 500;
  if (textLower.includes(queryLower)) return 100;

  let score = 0;
  let queryIndex = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      score += 10;
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length ? score : 0;
};

export const HeroSearchBar: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: placesData, isLoading } = trpc.places.getAll.useQuery(
    { limit: 200 },
    { staleTime: 60000 },
  );

  const allResults = useMemo<SearchResult[]>(() => {
    if (!placesData) return [];
    return placesData.map((place) => ({
      name: place.name,
      slug: place.slug,
      type: place.type === 'museum' ? 'Museum' : 'Monument',
      image: place.images[0],
      city: place.city,
      state: place.state,
      country: place.country,
      location: place.location,
      destinationType: place.type,
    }));
  }, [placesData]);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return allResults.slice(0, 50);

    const results: Array<SearchResult & { score: number }> = [];

    allResults.forEach((result) => {
      const nameScore = fuzzyMatch(result.name, query);
      const cityScore = fuzzyMatch(result.city, query);
      const stateScore = fuzzyMatch(result.state, query);
      const countryScore = fuzzyMatch(result.country, query);
      const locationScore = fuzzyMatch(result.location, query);

      const totalScore =
        nameScore * 5 +
        cityScore * 3 +
        stateScore * 2 +
        countryScore * 1 +
        locationScore * 2;

      if (totalScore > 0) {
        results.push({ ...result, score: totalScore });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [query, allResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(
      `/search?country=${encodeURIComponent(result.country.toLowerCase())}&state=${encodeURIComponent(result.state.toLowerCase())}&city=${encodeURIComponent(result.city.toLowerCase())}&lookFor=${result.slug}&destinationType=${result.destinationType}` as Route,
    );
    setIsOpen(false);
    setQuery('');
  };

  const handleNoResultsClick = () => {
    router.push(`/search?lookFor=${encodeURIComponent(query)}` as Route);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <Input
        ref={inputRef}
        placeholder='Search by name, city or state'
        className='w-[400px] rounded-lg px-5 bg-background py-6'
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
      />
      <Button
        size='icon'
        className='absolute top-1/2 right-2 -translate-y-1/2 rounded-sm shadow-none'
      >
        <Search />
      </Button>

      {/* Loading skeleton */}
      {isOpen && isLoading && (
        <div className='absolute top-full mt-2 w-[400px] bg-background border rounded-lg shadow-lg z-20 p-3 flex flex-col gap-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center gap-3 animate-pulse'>
              <div className='size-8 bg-muted rounded-sm shrink-0' />
              <div className='flex flex-col gap-1.5 flex-1'>
                <div className='h-3 bg-muted rounded w-2/3' />
                <div className='h-3 bg-muted rounded w-1/2' />
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Results dropdown */}
      {isOpen && !isLoading && searchResults.length > 0 && (
        <div className='absolute max-h-[400px] top-full mt-2 w-[400px] bg-background border rounded-lg shadow-lg overflow-y-scroll z-20'>
          {searchResults.map((result, index) => (
            <button
              key={`${result.slug}-${index}`}
              onClick={() => handleResultClick(result)}
              className='w-full p-3 flex justify-between items-start hover:bg-accent/50 transition-colors text-left border-b last:border-b-0'
            >
              <div className='flex gap-2 items-center'>
                {result.image ? (
                  <div className='size-8 bg-primary/20 rounded-sm relative' >
                    <Image
                      src={result.image}
                      blurDataURL=''
                      alt='heroImage'
                      fill
                      unoptimized
                      className='object-cover object-top rounded-sm'
                    />
                  </div>
                ) : (
                  <div className='size-8 bg-primary/20 rounded-sm relative' >
                  </div>
                )}
                <div>
                  <p className='font-medium leading-none text-sm'>
                    {result.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {result.type} &bull; {result.city}, {result.state},{' '}
                    {result.country}
                  </p>
                </div>
              </div>
              <ArrowUpRight className='w-5 h-5 text-muted-foreground shrink-0 ml-2' />
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && !isLoading && query.trim() && searchResults.length === 0 && (
        <div className='absolute top-full mt-2 w-[400px] bg-background border rounded-lg shadow-lg z-50'>
          <button
            onClick={handleNoResultsClick}
            className='w-full p-4 hover:bg-accent/50 transition-colors text-left'
          >
            <p className='text-sm text-foreground'>
              Look for &quot;{query}&quot;
            </p>
          </button>
        </div>
      )}
    </div>
  );
};
