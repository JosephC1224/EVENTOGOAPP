'use client';

import Link from 'next/link';
import Logo from './logo';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { Button } from './ui/button';
import { useSession } from '@/hooks/use-session';

export default function AppHeader() {
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
