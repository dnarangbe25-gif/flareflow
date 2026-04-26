"use client";

import React from "react";
import { ArrowDownUp, Wallet } from "lucide-react";

interface SwapInterfaceProps {
  activeTab: "swap" | "liquidity";
  setActiveTab: (tab: "swap" | "liquidity") => void;
  amount: string;
  setAmount: (val: string) => void;
  estimatedReceive: string;
  isProcessing: boolean;
  onAction: () => void;
  onConnect: () => void;
  address?: string | null;
  xlmBalance: string;
  flreBalance: string;
  swapDirection: "xlm-to-flre" | "flre-to-xlm";
  onToggleDirection: () => void;
}

export default function SwapInterface({
  activeTab,
  setActiveTab,
  amount,
  setAmount,
  estimatedReceive,
  isProcessing,
  onAction,
  onConnect,
  address,
  xlmBalance,
  flreBalance,
  swapDirection,
  onToggleDirection
}: SwapInterfaceProps) {
  
  const isXlmSource = swapDirection === "xlm-to-flre";
  const sourceBalance = isXlmSource ? xlmBalance : flreBalance;
  const sourceSymbol = isXlmSource ? "XLM" : "FLRE";
  const destSymbol = isXlmSource ? "FLRE" : "XLM";

  const handleMax = () => {
    const max = parseFloat(sourceBalance.replace(/,/g, ''));
    if (isNaN(max)) return;
    const safe = isXlmSource ? Math.max(0, max - 2) : max;
    setAmount(safe.toString());
  };

  const handleConnectClick = () => {
    console.log("SwapInterface: Connect Wallet clicked");
    onConnect();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6 relative z-10">
      {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-100 mb-2">
        {["swap", "liquidity"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-sm font-bold uppercase transition-all relative ${
              activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      <div className="relative flex flex-col gap-1">
        {/* Sell Input Container */}
        <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>{activeTab === "swap" ? "Sell" : "Deposit"}</span>
            <span>Balance: {sourceBalance}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="number" 
              placeholder="0.00" 
              className="bg-transparent border-none outline-none text-2xl font-bold text-black w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMax}
                className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-50 transition-all"
              >
                MAX
              </button>
              <span className="font-bold text-gray-500">{sourceSymbol}</span>
            </div>
          </div>
        </div>

        {/* Swap Button (Overlapping) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button 
            onClick={onToggleDirection}
            className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowDownUp size={18} />
          </button>
        </div>

        {/* Buy Input Container */}
        <div className="bg-gray-100 rounded-xl p-4 flex flex-col gap-2 mt-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>{activeTab === "swap" ? "Buy (Estimated)" : "Pool Share"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="text" 
              placeholder={amount ? estimatedReceive : "0.00"} 
              className="bg-transparent border-none outline-none text-2xl font-bold text-black/50 w-full cursor-not-allowed"
              disabled 
            />
            <span className="font-bold text-gray-500">{destSymbol}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={address ? onAction : handleConnectClick}
        disabled={isProcessing}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-50 relative z-20 cursor-pointer"
      >
        {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {isProcessing ? "Processing..." : address ? (activeTab === "swap" ? "SWAP ASSETS" : "ADD LIQUIDITY") : "CONNECT WALLET"}
      </button>
    </div>
  );
}
