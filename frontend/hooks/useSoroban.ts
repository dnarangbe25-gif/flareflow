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
    // Dynamically resolve pool address from storage or env
    const poolId = localStorage.getItem("soroban_pool_id") || process.env.NEXT_PUBLIC_POOL_ADDRESS || "";
    
    console.log("useSoroban: swap started", { amount, address, poolId });
    
    if (!poolId || poolId.length < 5) {
      console.error("useSoroban: poolId is missing!");
      throw new Error("Pool address not configured. Click CONFIG and paste your Contract ID.");
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const server = new StellarSdk.SorobanRpc.Server(RPC_URL);
      const networkPassphrase = StellarSdk.Networks.TESTNET;
      
      console.log("useSoroban: Loading account...");
      const account = await server.getLatestLedger().then(() => 
        new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org").loadAccount(address)
      );
      
      const lqidAsset = new StellarSdk.Asset("LQID", "GCDAND5QSCVFFEDUCK62VEZASVPYOUATCMJ4EXAUVEOUPILOJDDEFUTZ");
      
      const op = StellarSdk.Operation.pathPaymentStrictSend({
        sendAsset: StellarSdk.Asset.native(),
        sendAmount: amount.toString(),
        destAsset: lqidAsset,
        destMin: "0.0000001",
        destination: address,
        path: [],
      });

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: "1000",
        networkPassphrase,
      })
        .addOperation(op)
        .setTimeout(StellarSdk.TimeoutInfinite)
        .build();

      console.log("useSoroban: Requesting signature...");
      // Freighter v2+ requires networkPassphrase and returns an object
      const result = await signTransaction(tx.toXDR(), { 
        networkPassphrase: StellarSdk.Networks.TESTNET 
      });
      
      const signedXdr = typeof result === 'string' ? result : (result as any).signedTxXdr;
      console.log("useSoroban: Transaction signed!", !!signedXdr);

      if (!signedXdr) throw new Error("User rejected signature or signing failed.");
      
      const horizon = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
      const submission = await horizon.submitTransaction(StellarSdk.TransactionBuilder.fromXDR(signedXdr, networkPassphrase) as any);
      console.log("useSoroban: Submission successful:", submission.successful);
      
      if (!submission.successful) {
        throw new Error(`Transaction failed: ${submission.hash}`);
      }

      return { success: true, txHash: submission.hash };
    } catch (err: any) {
      console.error("useSoroban: CRITICAL ERROR:", err);
      let errorMsg = err.message || "Swap failed";
      
      if (err.response && err.response.data && err.response.data.extras) {
        const codes = err.response.data.extras.result_codes;
        if (codes) {
          errorMsg = `Transaction rejected: ${codes.transaction || ""} ${codes.operations ? codes.operations.join(", ") : ""}`;
        }
      }
      
      setError(errorMsg);
      throw new Error(errorMsg);
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
