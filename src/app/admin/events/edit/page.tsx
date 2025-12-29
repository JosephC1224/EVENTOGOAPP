'use client';

import { useSession } from '@/hooks/use-session';
import { getEventById } from '@/lib/data';
import { notFound, redirect, useSearchParams } from 'next/navigation';
import EventForm from '@/components/admin/event-form';
import { useEffect, useState } from 'react';
import { Event } from '@/lib/types';

export default function EditEventPage() {
  const { user, loading: sessionLoading } = useSession();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!sessionLoading && user?.role !== 'Admin') {
      redirect('/');
    }
  }, [user, sessionLoading]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getEventById(id).then(eventData => {
        if (!eventData) {
          notFound();
        } else {
          setEvent(eventData);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (sessionLoading || loading) {
    return <div className="container mx-auto px-4 py-8">Loading event...</div>;
  }

   if (!user) {
    return <div className="container mx-auto px-4 py-8">Access Denied</div>;
  }
  
  // If there's an ID but the event hasn't been loaded yet, show loading
  if (id && !event) {
    return <div className="container mx-auto px-4 py-8">Loading event...</div>;
  }

  // If we have an id but the event fetch resulted in notFound (event will be null)
  if (id && event === null) {
      notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EventForm event={event} />
    </div>
  );
}
