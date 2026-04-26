"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BalanceCardProps {
  type: "xlm" | "flre";
  value: string;
  address?: string;
  isLoading?: boolean;
}

export default function BalanceCard({ type, value, address, isLoading }: BalanceCardProps) {
  const [copied, setCopied] = useState(false);
  const isXLM = type === "xlm";
  
  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
          {type} Balance
        </span>
      </div>
      
      <div>
        {isLoading ? (
          <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-lg" />
        ) : (
          <h2 className="text-2xl font-bold text-black">
            {value} <span className="uppercase">{type}</span>
          </h2>
        )}
        <p className="text-sm text-gray-400 mt-1">
          ≈ ${value === "---" ? "0.00" : (parseFloat(value.replace(/,/g, '')) * (isXLM ? 0.11 : 1.05)).toFixed(2)} USD
        </p>
      </div>
      
      {address && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-sm">
          <span className="text-gray-500 font-mono truncate mr-4">
            {address.slice(0, 8)}...{address.slice(-8)}
          </span>
          <button 
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-black transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
