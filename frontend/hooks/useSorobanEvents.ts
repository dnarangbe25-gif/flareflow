"use client";

import { useEventsContext } from "../context/EventsContext";

export const useSorobanEvents = () => {
  const { events, isSyncing, error } = useEventsContext();

  return { 
    events, 
    isSyncing, 
    error,
    // Add custom filter logic if needed
    swapEvents: events.filter(e => e.type === 'SWAP'),
    liquidityEvents: events.filter(e => e.type === 'LIQUIDITY')
  };
};
