"use client";

import React, { createContext, useContext, useState } from "react";

export interface AppEvent {
  id: string;
  type: "swap" | "liquidity" | "event";
  desc: string;
  timestamp: string;
  txHash?: string;
}

interface EventsContextType {
  events: AppEvent[];
  addEvent: (event: Omit<AppEvent, "id" | "timestamp">) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<AppEvent[]>([]);

  const addEvent = (event: Omit<AppEvent, "id" | "timestamp">) => {
    const newEvent: AppEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    
    setEvents((prev) => {
      const merged = [newEvent, ...prev];
      return merged.slice(0, 50); // Keep max 50 recent events
    });
  };

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error("useEventsContext must be used within EventsProvider");
  return context;
};
