"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { isConnected, getPublicKey } from "@stellar/freighter-api";

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
    setIsConnecting(true);
    setError(null);
    try {
      const freighter = (window as any).freighter;
      
      let result = "";
      try {
        if (freighter && freighter.requestAccess) {
          result = await freighter.requestAccess();
        } else {
          result = await getPublicKey();
        }
      } catch (e) {
        if (await isConnected()) result = await getPublicKey();
      }

      const publicKey = Array.isArray(result) ? result[0] : result;

      if (publicKey && typeof publicKey === "string" && publicKey.length > 5) {
        setAddress(publicKey);
      } else {
        setError("Connection failed: No public key shared. Please open Freighter and approve the request.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to wallet.");
      console.error("WalletContext: Connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    // Auto-connect if already authorized
    const checkConnection = async () => {
      try {
        if (await isConnected()) {
          const pubKey = await getPublicKey();
          if (pubKey && typeof pubKey === "string" && pubKey.length > 5) {
            setAddress(pubKey);
          }
        }
      } catch (e) {
        // Ignore
      }
    };
    checkConnection();
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
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
}
