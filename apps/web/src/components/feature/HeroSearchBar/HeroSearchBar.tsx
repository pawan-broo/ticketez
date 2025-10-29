'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database, type MonumentOrMuseum } from '@/constants/database';
import type { Route } from 'next';

interface SearchResult {
  name: string;
  type: 'Monument' | 'Museum';
  city: string;
  state: string;
  country: string;
  googleMapLink: string;
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

  const allResults = useMemo(() => {
    const results: SearchResult[] = [];

    Database.forEach((countryData) => {
      countryData.states.forEach((stateData) => {
        stateData.city.forEach((cityData) => {
          const processItems = (
            items: MonumentOrMuseum[],
            type: 'Monument' | 'Museum',
          ) => {
            items.forEach((item) => {
              results.push({
                name: item.name,
                type,
                city: cityData.city,
                state: stateData.state,
                country: countryData.country,
                googleMapLink: item.googleMapLink,
              });
            });
          };

          processItems(cityData.monuments, 'Monument');
          processItems(cityData.museums, 'Museum');
        });
      });
    });

    return results;
  }, []);

  const searchResults = useMemo(() => {
    if (!query.trim()) return allResults.slice(0, 50); // Show first 50 when empty

    const results: Array<SearchResult & { score: number }> = [];

    Database.forEach((countryData) => {
      countryData.states.forEach((stateData) => {
        stateData.city.forEach((cityData) => {
          const processItems = (
            items: MonumentOrMuseum[],
            type: 'Monument' | 'Museum',
          ) => {
            items.forEach((item) => {
              const nameScore = fuzzyMatch(item.name, query);
              const cityScore = fuzzyMatch(cityData.city, query);
              const stateScore = fuzzyMatch(stateData.state, query);
              const countryScore = fuzzyMatch(countryData.country, query);
              const locationScore = fuzzyMatch(item.location, query);

              const totalScore =
                nameScore * 5 +
                cityScore * 3 +
                stateScore * 2 +
                countryScore * 1 +
                locationScore * 2;

              if (totalScore > 0) {
                results.push({
                  name: item.name,
                  type,
                  city: cityData.city,
                  state: stateData.state,
                  country: countryData.country,
                  googleMapLink: item.googleMapLink,
                  score: totalScore,
                });
              }
            });
          };

          processItems(cityData.monuments, 'Monument');
          processItems(cityData.museums, 'Museum');
        });
      });
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
    const slug = result.name.toLowerCase().replace(/\s+/g, '-');
    const countrySlug = result.country.toLowerCase().replace(/\s+/g, '-');
    const stateSlug = result.state.toLowerCase().replace(/\s+/g, '-');
    const citySlug = result.city.toLowerCase().replace(/\s+/g, '-');

    router.push('/');

    router.push(
      `/search?country=${countrySlug}&state=${stateSlug}&city=${citySlug}&lookFor=${slug}&destinationType=${result.type.toLowerCase()}` as Route,
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

      {isOpen && searchResults.length > 0 && (
        <div className='absolute max-h-[400px] top-full mt-2 w-[400px] bg-background border rounded-lg shadow-lg  overflow-y-scroll z-20'>
          {searchResults.map((result, index) => (
            <button
              key={`${result.name}-${index}-${result.city}`}
              onClick={() => handleResultClick(result)}
              className='w-full p-3 flex justify-between items-start hover:bg-accent/50 transition-colors text-left border-b last:border-b-0'
            >
              <div className='flex gap-2 items-center'>
                <div className='size-8 bg-primary/20 rounded-sm' />{' '}
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

      {isOpen && query.trim() && searchResults.length === 0 && (
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
