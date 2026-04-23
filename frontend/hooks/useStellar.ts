import { useState, useEffect, useCallback } from "react";
import { isConnected, getPublicKey, signTransaction } from "@stellar/freighter-api";

export const useStellar = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (await isConnected()) {
        const publicKey = await getPublicKey();
        setAddress(publicKey);
      } else {
        setError("Freighter not found. Please install the extension.");
      }
    } catch (err) {
      setError("Failed to connect to wallet.");
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = () => {
    setAddress(null);
  };

  return { address, isConnecting, error, connect, disconnect };
};
