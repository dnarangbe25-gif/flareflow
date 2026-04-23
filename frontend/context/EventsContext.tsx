"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { withRetry } from "../utils/retry";

export interface SorobanEvent {
  id: string;
  type: string;
  contract: string;
  data: any;
  timestamp: string;
  txHash: string;
}

interface EventsContextType {
  events: SorobanEvent[];
  isSyncing: boolean;
  error: string | null;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);
const server = new StellarSdk.rpc.Server("https://soroban-testnet.stellar.org");

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<SorobanEvent[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastLedger = useRef<number | null>(null);

  const fetchEvents = async () => {
    try {
      setIsSyncing(true);
      setError(null);

      // Use the retry utility for network resilience
      const response = await withRetry(() => 
        server.getEvents({
          startLedger: lastLedger.current || undefined,
          limit: 10,
        })
      );

      if (response.events && response.events.length > 0) {
        const newEvents: SorobanEvent[] = response.events.map((e) => ({
          id: e.id,
          type: "CONTRACT_EVENT",
          contract: e.contractId,
          data: e.value,
          timestamp: new Date().toISOString(),
          txHash: e.transactionHash,
        }));

        setEvents((prev) => {
          const merged = [...newEvents, ...prev];
          return Array.from(new Map(merged.map(item => [item.id, item])).values())
            .sort((a, b) => b.id.localeCompare(a.id))
            .slice(0, 50);
        });

        const latestLedger = Math.max(...response.events.map(e => e.ledger));
        lastLedger.current = latestLedger + 1;
      }
    } catch (err) {
      setError("Sync failed. Check your internet connection.");
      console.error("Poller Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchEvents, 8000); // Polling every 8s
    fetchEvents();
    return () => clearInterval(interval);
  }, []);

  return (
    <EventsContext.Provider value={{ events, isSyncing, error }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error("useEventsContext must be used within EventsProvider");
  return context;
};
