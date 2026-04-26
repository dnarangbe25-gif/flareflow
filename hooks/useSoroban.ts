import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "";
const POOL_ADDRESS = process.env.NEXT_PUBLIC_POOL_ADDRESS || "";
const RPC_URL = "https://soroban-testnet.stellar.org";

export const useSoroban = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swap = async (amount: string, address: string) => {
    console.log("useSoroban: swap() triggered", { amount, address });
    setIsLoading(true);
    setError(null);
    
    try {
      const networkPassphrase = StellarSdk.Networks.TESTNET;
      const horizonUrl = "https://horizon-testnet.stellar.org";
      
      console.log("useSoroban: Loading account from Horizon...");
      const horizon = new StellarSdk.Horizon.Server(horizonUrl);
      const account = await horizon.loadAccount(address);
      console.log("useSoroban: Account loaded, sequence:", account.sequenceNumber());
      
      const flreAsset = new StellarSdk.Asset("FLRE", "GCGUQ2F6LKRCD6PUDJKTVNGNEFVGJJPLBM7L64I5YFM7SBQGGXNXMVUM");
      
      console.log("useSoroban: Building transaction...");
      const op = StellarSdk.Operation.pathPaymentStrictSend({
        sendAsset: StellarSdk.Asset.native(),
        sendAmount: amount,
        destAsset: flreAsset,
        destMin: "0.0000001",
        destination: address,
        path: [],
      });

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "10000", // Increased fee for faster processing
        networkPassphrase,
      })
        .addOperation(op)
        .setTimeout(StellarSdk.TimeoutInfinite)
        .build();

      const xdr = tx.toXDR();
      console.log("useSoroban: Transaction built. Requesting Freighter signature...");
      
      // Use direct window check for max reliability
      let result: any;
      const f = (window as any).freighter;
      if (f && f.signTransaction) {
        console.log("useSoroban: Using window.freighter.signTransaction");
        result = await f.signTransaction(xdr, { networkPassphrase });
      } else {
        console.log("useSoroban: Using @stellar/freighter-api signTransaction");
        result = await signTransaction(xdr, { networkPassphrase });
      }

      console.log("useSoroban: signTransaction raw result:", result);
      const signedXdr = typeof result === 'string' ? result : result?.signedTxXdr;

      if (!signedXdr) {
        throw new Error("Transaction signature was not returned. Did you cancel the request?");
      }

      console.log("useSoroban: Submitting to network...");
      const submission = await horizon.submitTransaction(StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase) as any);
      console.log("useSoroban: Final submission result:", submission);

      if (!submission.successful) {
        throw new Error(`Submission failed. Hash: ${submission.hash}`);
      }

      return { success: true, txHash: submission.hash };
    } catch (err: any) {
      console.error("useSoroban: ERROR", err);
      const msg = err.message || "Swap failed";
      setError(msg);
      alert("SWAP ERROR: " + msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addLiquidity = async (amount: string, address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Adding ${amount} liquidity for ${address}`);
      await new Promise(r => setTimeout(r, 2000));
      return { success: true, txHash: "0x" + Math.random().toString(16).slice(2) };
    } catch (err: any) {
      setError(err.message || "Failed to add liquidity");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { swap, addLiquidity, isLoading, error };
};
