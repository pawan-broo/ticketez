'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MapPin, Ticket, LogOut, Menu, X, BarChart3 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const adminNavLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Places', href: '/admin/places', icon: MapPin },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Bookings', href: '/admin/bookings', icon: Ticket },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/admin/login' as any);
  };

  return (
    <>
      {/* ── Desktop Sidebar (md+) ──────────────────────────────────────────── */}
      <aside className='hidden md:flex md:flex-col md:w-64 md:border-r md:h-full md:p-6 md:bg-background md:shrink-0'>
        {/* Logo */}
        <div className='flex items-center gap-3 mb-8'>
          <div className='size-8 rounded-full bg-primary shrink-0' />
          <span className='font-medium text-sm leading-tight'>Ticketez Admin</span>
        </div>

        {/* Nav Links */}
        <nav className='flex flex-col gap-1 flex-1'>
          {adminNavLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href as never}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className='size-4 shrink-0' />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        {session?.user && (
          <div className='border-t pt-4 mt-4'>
            <div className='flex items-center gap-3 mb-3'>
              <Avatar className='size-8'>
                <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ''} />
                <AvatarFallback className='text-xs'>
                  {(session.user.name ?? 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col min-w-0'>
                <span className='text-sm font-medium truncate'>{session.user.name}</span>
                <span className='text-xs text-muted-foreground truncate'>{session.user.email}</span>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='w-full justify-start gap-2 text-muted-foreground'
              onClick={handleSignOut}
            >
              <LogOut className='size-4' />
              Sign Out
            </Button>
          </div>
        )}
      </aside>

      {/* ── Mobile Top Nav (< md) ──────────────────────────────────────────── */}
      <div className='md:hidden flex flex-col w-full shrink-0'>
        {/* Top bar */}
        <div className='flex items-center justify-between px-4 py-3 border-b bg-background'>
          <div className='flex items-center gap-2'>
            <div className='size-6 rounded-full bg-primary shrink-0' />
            <span className='font-medium text-sm leading-tight'>Ticketez Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className='p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
          </button>
        </div>

        {/* Dropdown menu */}
        {mobileMenuOpen && (
          <div className='border-b bg-background px-3 py-3 flex flex-col gap-1 shadow-sm'>
            {/* Nav Links */}
            {adminNavLinks.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href as never}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className='size-4 shrink-0' />
                  {label}
                </Link>
              );
            })}

            {/* User Section */}
            {session?.user && (
              <div className='border-t pt-3 mt-2 flex flex-col gap-2'>
                <div className='flex items-center gap-3 px-3'>
                  <Avatar className='size-7'>
                    <AvatarImage
                      src={session.user.image ?? undefined}
                      alt={session.user.name ?? ''}
                    />
                    <AvatarFallback className='text-xs'>
                      {(session.user.name ?? 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col min-w-0'>
                    <span className='text-sm font-medium truncate'>{session.user.name}</span>
                    <span className='text-xs text-muted-foreground truncate'>
                      {session.user.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='justify-start gap-2 text-muted-foreground mx-3'
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className='size-4' />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
