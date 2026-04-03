'use client';

import React, { useEffect, useState } from 'react';

import { PlusCircle, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/utils/trpc';
import { AdminGuard } from '@/app/(admin)/_components/AdminGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

// ─── Types ───────────────────────────────────────────────────────────────────

type PlaceType = 'monument' | 'museum';

interface PlaceFormState {
  name: string;
  slug: string;
  type: PlaceType;
  country: string;
  state: string;
  city: string;
  location: string;
  latitude: string;
  longitude: string;
  googleMapLink: string;
  imagesRaw: string;
  videosRaw: string;
  shortDesc: string;
  longDesc: string;
  precautionsRaw: string;
  metadataRaw: string;
  ticketPriceRs: string;
  isActive: boolean;
}

type ExistingPlace = {
  id: string;
  name: string;
  slug: string;
  type: PlaceType;
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
  metadata: { label: string; data: string }[];
  ticketPrice: number;
  isActive: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function defaultForm(): PlaceFormState {
  return {
    name: '',
    slug: '',
    type: 'monument',
    country: 'India',
    state: '',
    city: '',
    location: '',
    latitude: '',
    longitude: '',
    googleMapLink: '',
    imagesRaw: '',
    videosRaw: '',
    shortDesc: '',
    longDesc: '',
    precautionsRaw: '',
    metadataRaw: '',
    ticketPriceRs: '0',
    isActive: true,
  };
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function placeToForm(p: ExistingPlace): PlaceFormState {
  return {
    name: p.name,
    slug: p.slug,
    type: p.type,
    country: p.country,
    state: p.state,
    city: p.city,
    location: p.location,
    latitude: p.latitude !== null ? String(p.latitude) : '',
    longitude: p.longitude !== null ? String(p.longitude) : '',
    googleMapLink: p.googleMapLink ?? '',
    imagesRaw: p.images.join('\n'),
    videosRaw: p.videos.join('\n'),
    shortDesc: p.shortDesc ?? '',
    longDesc: p.longDesc ?? '',
    precautionsRaw: p.precautionAndSafety.join('\n'),
    metadataRaw: p.metadata.map((m) => `${m.label}: ${m.data}`).join('\n'),
    ticketPriceRs: String(p.ticketPrice / 100),
    isActive: p.isActive,
  };
}

function parseLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseMetadata(raw: string): { label: string; data: string }[] {
  return parseLines(raw)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return null;
      return {
        label: line.slice(0, idx).trim(),
        data: line.slice(idx + 1).trim(),
      };
    })
    .filter((x): x is { label: string; data: string } => x !== null);
}

// ─── Place Form Dialog ────────────────────────────────────────────────────────

interface PlaceFormDialogProps {
  open: boolean;
  onClose: () => void;
  editingPlace: ExistingPlace | null;
  onSuccess: () => void;
}

function PlaceFormDialog({
  open,
  onClose,
  editingPlace,
  onSuccess,
}: PlaceFormDialogProps) {
  const [form, setForm] = useState<PlaceFormState>(defaultForm());

  useEffect(() => {
    if (open) {
      setForm(editingPlace ? placeToForm(editingPlace) : defaultForm());
    }
  }, [editingPlace, open]);

  const setField =
    (key: keyof PlaceFormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const createMutation = trpc.places.adminCreate.useMutation({
    onSuccess: () => {
      toast.success('Place created successfully');
      onSuccess();
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.places.adminUpdate.useMutation({
    onSuccess: () => {
      toast.success('Place updated successfully');
      onSuccess();
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      country: form.country.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
      location: form.location.trim(),
      latitude:
        form.latitude !== '' ? Number(form.latitude) : undefined,
      longitude:
        form.longitude !== '' ? Number(form.longitude) : undefined,
      googleMapLink: form.googleMapLink.trim() || undefined,
      images: parseLines(form.imagesRaw),
      videos: parseLines(form.videosRaw),
      shortDesc: form.shortDesc.trim() || undefined,
      longDesc: form.longDesc.trim() || undefined,
      precautionAndSafety: parseLines(form.precautionsRaw),
      metadata: parseMetadata(form.metadataRaw),
      ticketPrice: Math.round(Number(form.ticketPriceRs) * 100),
      isActive: form.isActive,
    };

    if (editingPlace) {
      updateMutation.mutate({ id: editingPlace.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {editingPlace ? 'Edit Place' : 'Add New Place'}
          </DialogTitle>
          <DialogDescription>
            {editingPlace
              ? 'Update the details for this destination.'
              : 'Fill in the details for the new destination.'}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable form body */}
        <div className='max-h-[65vh] overflow-y-auto pr-2 space-y-5'>
          {/* Name */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-name'>Name</Label>
            <Input
              id='pf-name'
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({ ...prev, name }));
              }}
              placeholder='Taj Mahal'
            />
          </div>

          {/* Slug */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-slug'>Slug</Label>
            <div className='flex gap-2'>
              <Input
                id='pf-slug'
                value={form.slug}
                onChange={setField('slug')}
                placeholder='taj-mahal'
                className='flex-1'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    slug: toKebabCase(prev.name),
                  }))
                }
              >
                Generate
              </Button>
            </div>
          </div>

          {/* Type */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-type'>Type</Label>
            <select
              id='pf-type'
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value as PlaceType,
                }))
              }
              className='border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]'
            >
              <option value='monument'>Monument</option>
              <option value='museum'>Museum</option>
            </select>
          </div>

          {/* Country / State / City */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='pf-country'>Country</Label>
              <Input
                id='pf-country'
                value={form.country}
                onChange={setField('country')}
                placeholder='India'
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='pf-state'>State</Label>
              <Input
                id='pf-state'
                value={form.state}
                onChange={setField('state')}
                placeholder='Uttar Pradesh'
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='pf-city'>City</Label>
              <Input
                id='pf-city'
                value={form.city}
                onChange={setField('city')}
                placeholder='Agra'
              />
            </div>
          </div>

          {/* Location */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-location'>Location (full address)</Label>
            <Input
              id='pf-location'
              value={form.location}
              onChange={setField('location')}
              placeholder='Dharmapuri, Forest Colony, Tajganj, Agra'
            />
          </div>

          {/* Lat / Lng */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label htmlFor='pf-lat'>Latitude (optional)</Label>
              <Input
                id='pf-lat'
                type='number'
                value={form.latitude}
                onChange={setField('latitude')}
                placeholder='27.1751'
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='pf-lng'>Longitude (optional)</Label>
              <Input
                id='pf-lng'
                type='number'
                value={form.longitude}
                onChange={setField('longitude')}
                placeholder='78.0421'
              />
            </div>
          </div>

          {/* Google Map Link */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-map'>Google Map Link (optional)</Label>
            <Input
              id='pf-map'
              type='url'
              value={form.googleMapLink}
              onChange={setField('googleMapLink')}
              placeholder='https://maps.google.com/...'
            />
          </div>

          {/* Images */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-images'>
              Images{' '}
              <span className='text-muted-foreground font-normal text-xs'>
                (one URL per line)
              </span>
            </Label>
            <Textarea
              id='pf-images'
              value={form.imagesRaw}
              onChange={setField('imagesRaw')}
              placeholder={
                'https://cdn.example.com/img1.jpg\nhttps://cdn.example.com/img2.jpg'
              }
              className='min-h-[80px]'
            />
          </div>

          {/* Videos */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-videos'>
              Videos{' '}
              <span className='text-muted-foreground font-normal text-xs'>
                (one URL per line)
              </span>
            </Label>
            <Textarea
              id='pf-videos'
              value={form.videosRaw}
              onChange={setField('videosRaw')}
              placeholder='https://youtube.com/watch?v=...'
              className='min-h-[60px]'
            />
          </div>

          {/* Short Desc */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-short'>Short Description</Label>
            <Textarea
              id='pf-short'
              value={form.shortDesc}
              onChange={setField('shortDesc')}
              placeholder='A brief one-liner description...'
              className='min-h-[60px]'
            />
          </div>

          {/* Long Desc */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-long'>Long Description</Label>
            <Textarea
              id='pf-long'
              value={form.longDesc}
              onChange={setField('longDesc')}
              placeholder='Full description with history, notable features, visiting tips...'
              className='min-h-[100px]'
            />
          </div>

          {/* Precautions */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-precautions'>
              Precautions & Safety{' '}
              <span className='text-muted-foreground font-normal text-xs'>
                (one per line)
              </span>
            </Label>
            <Textarea
              id='pf-precautions'
              value={form.precautionsRaw}
              onChange={setField('precautionsRaw')}
              placeholder={'No smoking inside the complex\nDress modestly\nNo outside food allowed'}
              className='min-h-[80px]'
            />
          </div>

          {/* Metadata */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-meta'>
              Metadata{' '}
              <span className='text-muted-foreground font-normal text-xs'>
                (format: <code>Label: Value</code>, one per line)
              </span>
            </Label>
            <Textarea
              id='pf-meta'
              value={form.metadataRaw}
              onChange={setField('metadataRaw')}
              placeholder={'Built: 1653\nTimings: 6AM - 6PM\nClosed on: Fridays'}
              className='min-h-[80px]'
            />
          </div>

          {/* Ticket Price */}
          <div className='space-y-1.5'>
            <Label htmlFor='pf-price'>Ticket Price (₹)</Label>
            <Input
              id='pf-price'
              type='number'
              min={0}
              value={form.ticketPriceRs}
              onChange={setField('ticketPriceRs')}
              placeholder='50'
            />
            {Number(form.ticketPriceRs) > 0 && (
              <p className='text-xs text-muted-foreground'>
                Stored as {Math.round(Number(form.ticketPriceRs) * 100)} paise
              </p>
            )}
          </div>

          {/* Is Active */}
          <div className='flex items-center gap-3 pt-1'>
            <Switch
              id='pf-active'
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isActive: checked }))
              }
            />
            <Label htmlFor='pf-active' className='cursor-pointer'>
              Active{' '}
              <span className='text-muted-foreground font-normal'>
                (visible to users)
              </span>
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving
              ? editingPlace
                ? 'Saving...'
                : 'Creating...'
              : editingPlace
                ? 'Save Changes'
                : 'Create Place'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'monument' | 'museum'>(
    'all',
  );
  const [editingPlace, setEditingPlace] = useState<ExistingPlace | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);



  const {
    data: places,
    isLoading,
    refetch,
  } = trpc.places.adminGetAll.useQuery({
    type: typeFilter,
    search: searchQuery || undefined,
    limit: 200,
  });

  const deleteMutation = trpc.places.adminDelete.useMutation({
    onSuccess: () => {
      toast.success('Place deleted');
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleActiveMutation = trpc.places.adminToggleActive.useMutation({
    onSuccess: () => refetch(),
    onError: (err) => toast.error(err.message),
  });

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`))
      return;
    deleteMutation.mutate({ id });
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive: !currentActive });
  };



  const dialogOpen = isCreateOpen || editingPlace !== null;

  return (
    <AdminGuard>
      <div className='container border-x min-h-full px-4 py-10 sm:px-8 sm:py-16 md:px-12 md:py-[80px] space-y-8'>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-medium text-primary'>Places</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage destinations available for booking
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <PlusCircle className='size-4' />
          Add New Place
        </Button>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div className='flex flex-col sm:flex-row gap-3'>
        {/* Search */}
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by name, city or state...'
            className='pl-9'
          />
        </div>

        {/* Type filter */}
        <div className='flex border rounded-md overflow-hidden shrink-0'>
          {(['all', 'monument', 'museum'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                typeFilter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {tab === 'all' ? 'All' : `${tab}s`}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <Button
          variant='outline'
          size='icon'
          onClick={() => refetch()}
          title='Refresh list'
        >
          <RefreshCw className='size-4' />
        </Button>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className='border rounded-lg overflow-hidden'>
        {isLoading ? (
          <div className='p-6 space-y-3'>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded' />
            ))}
          </div>
        ) : !places?.length ? (
          <div className='px-6 py-16 text-center text-muted-foreground text-sm'>
            No places found.{' '}
            <button
              className='underline text-primary'
              onClick={() => setIsCreateOpen(true)}
            >
              Add one now.
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b bg-muted/40'>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Name
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    Type
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    City
                  </th>
                  <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                    State
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Ticket Price
                  </th>
                  <th className='text-center px-4 py-3 font-medium text-muted-foreground'>
                    Active
                  </th>
                  <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {places.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b last:border-0 ${
                      i % 2 === 0 ? 'bg-background' : 'bg-accent/20'
                    }`}
                  >
                    <td className='px-4 py-3'>
                      <div className='font-medium'>{p.name}</div>
                      <div className='text-xs text-muted-foreground font-mono'>
                        {p.slug}
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <Badge
                        className={
                          p.type === 'monument'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }
                      >
                        {p.type}
                      </Badge>
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>
                      {p.city}
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>
                      {p.state}
                    </td>
                    <td className='px-4 py-3 text-right font-medium'>
                      ₹{(p.ticketPrice / 100).toFixed(0)}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <Switch
                        checked={p.isActive}
                        onCheckedChange={() =>
                          handleToggleActive(p.id, p.isActive)
                        }
                        disabled={toggleActiveMutation.isPending}
                        aria-label={`Toggle active for ${p.name}`}
                      />
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='outline'
                          size='icon-sm'
                          title='Edit place'
                          onClick={() =>
                            setEditingPlace(p as unknown as ExistingPlace)
                          }
                        >
                          <Pencil className='size-3.5' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='icon-sm'
                          title='Delete place'
                          disabled={deleteMutation.isPending}
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 className='size-3.5' />
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

      {/* ── Create / Edit Dialog ─────────────────────────────────────────────── */}
      <PlaceFormDialog
        open={dialogOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingPlace(null);
        }}
        editingPlace={editingPlace}
        onSuccess={() => refetch()}
      />
      </div>
    </AdminGuard>
  );
}
