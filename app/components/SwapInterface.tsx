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
    <div className="glass-card p-8 flex flex-col gap-6 relative z-10 overflow-hidden">
      {/* Background Decorative Flare */}
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl -z-10" />

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-amber-50 mb-2">
        {["swap", "liquidity"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab ? "text-amber-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full shadow-[0_-2px_10px_rgba(245,158,11,0.3)]" />
            )}
          </button>
        ))}
      </div>

      <div className="relative flex flex-col gap-2">
        {/* Sell Input Container */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 transition-colors focus-within:border-amber-200 focus-within:bg-white">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>{activeTab === "swap" ? "Sell" : "Deposit"}</span>
            <span>Balance: <span className="text-slate-600">{sourceBalance}</span></span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="number" 
              placeholder="0.00" 
              className="bg-transparent border-none outline-none text-3xl font-black text-slate-900 w-full placeholder:text-slate-200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMax}
                className="bg-amber-100/50 px-3 py-1.5 rounded-lg text-[10px] font-black text-amber-700 border border-amber-100 hover:bg-amber-100 transition-all"
              >
                MAX
              </button>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                <span className="font-black text-slate-700 text-sm">{sourceSymbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button (Overlapping) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <button 
            onClick={onToggleDirection}
            className="w-12 h-12 bg-white border-4 border-white rounded-2xl shadow-xl flex items-center justify-center text-amber-500 hover:text-orange-600 hover:scale-110 active:scale-95 transition-all group"
          >
            <div className="bg-amber-50 p-2 rounded-xl group-hover:bg-amber-100 transition-colors">
              <ArrowDownUp size={20} />
            </div>
          </button>
        </div>

        {/* Buy Input Container */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 mt-1 opacity-80">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>{activeTab === "swap" ? "Buy (Estimated)" : "Pool Share"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="text" 
              placeholder={amount ? estimatedReceive : "0.00"} 
              className="bg-transparent border-none outline-none text-3xl font-black text-slate-400 w-full cursor-not-allowed"
              disabled 
            />
            <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-xl border border-slate-100">
              <span className="font-black text-slate-500 text-sm">{destSymbol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={address ? onAction : handleConnectClick}
        disabled={isProcessing}
        className="btn-primary w-full py-5 relative z-20 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <div className="flex items-center justify-center gap-3 relative z-10">
          {isProcessing ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            !address && <Wallet size={18} />
          )}
          <span className="text-sm font-black tracking-widest">
            {isProcessing ? "IGNITING FLARE..." : address ? (activeTab === "swap" ? "SWAP ASSETS" : "ADD LIQUIDITY") : "CONNECT WALLET"}
          </span>
        </div>
      </button>

      {/* Footer Info */}
      <div className="flex justify-between px-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slippage Tolerance</span>
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">0.5%</span>
      </div>
    </div>
  );
}
