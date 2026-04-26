"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import * as Freighter from "@stellar/freighter-api";

interface WalletContextType {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    console.log("WalletContext V4: Connect Clicked");
    setIsConnecting(true);
    setError(null);
    
    try {
      // 1. Check if connected
      const connectedRes = await (Freighter as any).isConnected();
      const isConnected = typeof connectedRes === 'boolean' ? connectedRes : connectedRes?.isConnected;
      console.log("WalletContext V4: isConnected:", isConnected);

      if (!isConnected) {
        throw new Error("Freighter not detected. Please install and unlock the extension.");
      }

      // 2. Try requestAccess (New API returns { address: string })
      console.log("WalletContext V4: Calling requestAccess...");
      let pk = "";
      try {
        const res = await Freighter.requestAccess();
        console.log("WalletContext V4: requestAccess raw result:", res);
        if (typeof res === 'string') pk = res;
        else if (res && (res as any).address) pk = (res as any).address;
      } catch (e) {
        console.warn("WalletContext V4: requestAccess failed", e);
      }

      // 3. Try getAddress (New API returns { address: string })
      if (!pk) {
        console.log("WalletContext V4: Calling getAddress...");
        try {
          const res = await Freighter.getAddress();
          console.log("WalletContext V4: getAddress raw result:", res);
          if (typeof res === 'string') pk = res;
          else if (res && (res as any).address) pk = (res as any).address;
        } catch (e) {
          console.warn("WalletContext V4: getAddress failed", e);
        }
      }

      // 4. Final Fallback: Direct window object (Old API)
      if (!pk) {
        const f = (window as any).freighter;
        if (f && f.getPublicKey) {
          console.log("WalletContext V4: Calling window.freighter.getPublicKey...");
          pk = await f.getPublicKey();
        }
      }

      console.log("WalletContext V4: Resolved PK:", pk);

      if (pk && pk.length === 56 && pk.startsWith("G")) {
        setAddress(pk);
        console.log("WalletContext V4: SUCCESS");
      } else {
        throw new Error("No public key shared. Please unlock Freighter and approve the request.");
      }
    } catch (err: any) {
      console.error("WalletContext V4: Error:", err);
      const msg = err.message || "Connection failed";
      setError(msg);
      alert("FLARE FLOW ERROR: " + msg);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    const auto = async () => {
      try {
        const connectedRes = await (Freighter as any).isConnected();
        const isConnected = typeof connectedRes === 'boolean' ? connectedRes : connectedRes?.isConnected;
        if (isConnected) {
          const res = await Freighter.getAddress();
          const pk = typeof res === 'string' ? res : (res as any).address;
          if (pk && pk.length === 56) setAddress(pk);
        }
      } catch (e) {}
    };
    auto();
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) throw new Error("useWalletContext must be used within a WalletProvider");
  return context;
}
