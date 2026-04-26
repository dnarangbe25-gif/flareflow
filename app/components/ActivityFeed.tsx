"use client";

import { ArrowDownUp, Droplets, Zap, AlertCircle, ExternalLink } from "lucide-react";

interface Event {
  id: string;
  type: string;
  desc: string;
  timestamp: string;
  txHash?: string;
}

interface ActivityFeedProps {
  events: Event[];
  error?: string | null;
}

export default function ActivityFeed({ events, error }: ActivityFeedProps) {
  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="glass-card flex flex-col gap-4 h-full min-h-[300px]">
      <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">
        Live Activity Feed
      </p>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-500">
          <AlertCircle size={18} />
          <span className="text-sm font-bold uppercase tracking-tight">{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-black/5 hover:bg-white transition-all group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {event.type === 'swap' && <ArrowDownUp size={14} className="text-amber-500" />}
                  {event.type === 'liquidity' && <Droplets size={14} className="text-orange-500" />}
                  {event.type === 'event' && <Sun size={14} className="text-yellow-500" />}
                  <span className="font-bold text-sm text-[#0F172A]">{event.desc}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400">{getTimeAgo(event.timestamp)}</span>
              </div>
              {event.txHash && (
                <a 
                  href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-600/60 hover:text-amber-600"
                >
                  {event.txHash.slice(0, 12)}... <ExternalLink size={10} />
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <Zap size={32} className="mb-4 opacity-20" />
            <p className="text-sm italic font-medium">No activity yet. Start trading to see events!</p>
          </div>
        )}
      </div>
    </div>
  );
}
