'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/use-session';
import { getTicketsByUserId, getEventById } from '@/lib/data';
import { useRouter } from 'next/navigation';
import TicketCard from '@/components/ticket-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Event, Ticket } from '@/lib/types';


type EnrichedTicket = Ticket & { event?: Event };

export default function MyTicketsPage() {
  const { user, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<EnrichedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchTickets() {
      setLoading(true);
      const userTickets = await getTicketsByUserId(user!.id);
      
      const enrichedTickets = await Promise.all(
        userTickets.map(async (ticket) => {
          const event = await getEventById(ticket.eventId);
          return { ...ticket, event };
        })
      );

      setTickets(enrichedTickets);
      setLoading(false);
    }

    fetchTickets();
  }, [user, router, sessionLoading]);


  if (loading || sessionLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-10 w-1/4 mb-8" />
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight mb-8 font-headline">
        My Tickets
      </h1>
      {tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map((ticket) =>
            ticket.event ? <TicketCard key={ticket.id} ticket={ticket} event={ticket.event} /> : null
          )}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">You don't have any tickets yet.</h2>
          <p className="text-muted-foreground mb-4">Why not find an event to attend?</p>
          <Button asChild>
            <Link href="/">Browse Events</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
