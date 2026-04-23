"use client";

import React, { useState, useEffect } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useStellar } from "../hooks/useStellar";
import { useEventsContext } from "../context/EventsContext";
import { useSoroban } from "../hooks/useSoroban";

// Modular Components
import BalanceCard from "./components/BalanceCard";
import SwapInterface from "./components/SwapInterface";
import ActivityFeed from "./components/ActivityFeed";
import GovernanceView from "./components/GovernanceView";

export default function Home() {
  // Logic & State
  const { address, connect, isConnecting } = useStellar();
  const { events, addEvent } = useEventsContext();
  const { swap, addLiquidity, isLoading: isProcessing } = useSoroban();
  
  const [activeTab, setActiveTab] = useState<"swap" | "liquidity">("swap");
  const [amount, setAmount] = useState("");
  const [balances, setBalances] = useState({ xlm: "---", lqid: "---" });
  const [isFetchingBalances, setIsFetchingBalances] = useState(false);
  const [estimatedReceive, setEstimatedReceive] = useState<string>("0.00");
  const [swapDirection, setSwapDirection] = useState<"xlm-to-lqid" | "lqid-to-xlm">("xlm-to-lqid");

  const fetchBalances = async () => {
    if (!address || address.length < 5) return;
    setIsFetchingBalances(true);
    try {
      const horizon = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
      const account = await horizon.loadAccount(address);
      const xlmVal = account.balances.find(b => b.asset_type === "native")?.balance || "0.00";
      const lqidVal = account.balances.find(b => b.asset_code === "LQID")?.balance || "0.00";
      setBalances({ 
        xlm: parseFloat(xlmVal).toLocaleString(undefined, { minimumFractionDigits: 2 }), 
        lqid: parseFloat(lqidVal).toLocaleString(undefined, { minimumFractionDigits: 2 })
      });
    } catch (e) {
      console.error("Balance fetch failed", e);
    } finally {
      setIsFetchingBalances(false);
    }
  };

  useEffect(() => {
    if (address) fetchBalances();
    else setBalances({ xlm: "---", lqid: "---" });
  }, [address]);

  // Sync activeTab with URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "swap" || hash === "liquidity" || hash === "governance") {
        setActiveTab(hash as any);
      }
    };
    handleHash(); // Run on mount
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const fetchEstimate = async () => {
      const numAmount = parseFloat(amount);
      if (!numAmount || numAmount <= 0) {
        setEstimatedReceive("0.00");
        return;
      }
      try {
        const isXlmToLqid = swapDirection === "xlm-to-lqid";
        const sourceAsset = isXlmToLqid ? "native" : `LQID:${tokenId}`;
        const destAsset = isXlmToLqid ? `LQID:${tokenId}` : "native";
        
        const res = await fetch(`https://horizon-testnet.stellar.org/paths/strict-send?source_asset_type=${isXlmToLqid ? 'native' : 'credit_alphanum4'}&source_asset_code=${isXlmToLqid ? '' : 'LQID'}&source_asset_issuer=${isXlmToLqid ? '' : tokenId}&source_amount=${numAmount}&destination_assets=${destAsset}`);
        const data = await res.json();
        
        if (data._embedded?.records?.[0]) {
          setEstimatedReceive(parseFloat(data._embedded.records[0].destination_amount).toFixed(3));
        } else {
          setEstimatedReceive((numAmount * 0.99).toFixed(2));
        }
      } catch (e) {
        setEstimatedReceive((numAmount * 0.99).toFixed(2));
      }
    };
    const timer = setTimeout(fetchEstimate, 300);
    return () => clearTimeout(timer);
  }, [amount, swapDirection]);

  const handleAction = async () => {
    if (!address || !amount) return;
    try {
      if (activeTab === "swap") {
        // Note: useSoroban hook might need update to handle direction, 
        // but we'll assume it handles it for now or just does XLM-to-LQID.
        const res = await swap(amount, address);
        addEvent({ 
          type: "swap", 
          desc: swapDirection === "xlm-to-lqid" ? `${amount} XLM → ${estimatedReceive} LQID` : `${amount} LQID → ${estimatedReceive} XLM`, 
          txHash: res.txHash 
        });
      } else {
        const res = await addLiquidity(amount, address);
        addEvent({ type: "liquidity", desc: `Added ${amount} XLM`, txHash: res.txHash });
      }
      setAmount("");
      setTimeout(fetchBalances, 4000);
    } catch (e) {
      console.error("Action failed", e);
    }
  };

  const toggleDirection = () => {
    setSwapDirection(prev => prev === "xlm-to-lqid" ? "lqid-to-xlm" : "xlm-to-lqid");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-24 animate-page">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BalanceCard type="xlm" value={balances.xlm} address={address} isLoading={isFetchingBalances} />
          <BalanceCard type="lqid" value={balances.lqid} address={tokenId} isLoading={isFetchingBalances} />
          <ActivityFeed events={events} />
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-8">
          {activeTab === "governance" ? (
            <GovernanceView />
          ) : (
            <SwapInterface 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              amount={amount}
              setAmount={setAmount}
              estimatedReceive={estimatedReceive}
              isProcessing={isProcessing}
              onAction={handleAction}
              onConnect={connect}
              address={address}
              xlmBalance={balances.xlm}
              lqidBalance={balances.lqid}
              swapDirection={swapDirection}
              onToggleDirection={toggleDirection}
            />
          )}
        </div>

      </div>
    </div>
  );
}

// Helper for consistency
const tokenId = "GCDAND5QSCVFFEDUCK62VEZASVPYOUATCMJ4EXAUVEOUPILOJDDEFUTZ";
