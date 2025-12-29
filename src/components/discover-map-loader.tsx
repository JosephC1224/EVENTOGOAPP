'use client';

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/types";

const EventMap = dynamic(() => import('@/components/event-map'), {
    loading: () => <Skeleton className="w-full h-full" />,
    ssr: false
});

export default function DiscoverMapLoader({ events }: { events: Event[] }) {
    return <EventMap events={events} />;
}
