"use client";

import React, { useState } from "react";
import { Vote, ShieldCheck, Clock, X, CheckCircle2 } from "lucide-react";

export default function GovernanceView() {
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [proposals, setProposals] = useState([
    { id: 1, title: "Add USDC/XLM Pool", status: "Active", votes: "1.2M", time: "2d left", desc: "This proposal aims to add a USDC/XLM liquidity pool to the DEX to improve stablecoin accessibility." },
    { id: 2, title: "Increase LQID Rewards", status: "Passed", votes: "4.5M", time: "Closed", desc: "Increase the weekly distribution of LQID tokens to liquidity providers by 15%." },
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    
    if (!title) return;

    setSubmitted(true);
    setTimeout(() => {
      setProposals([{ 
        id: Date.now(), 
        title, 
        status: "Active", 
        votes: "0", 
        time: "7d left",
        desc: "New community proposal."
      }, ...proposals]);
      setShowModal(false);
      setSubmitted(false);
    }, 1500);
  };

  const handleVote = (type: "for" | "against") => {
    setVoting(true);
    setTimeout(() => {
      setVoting(false);
      setVoted(true);
      setTimeout(() => {
        setVoted(false);
        setSelectedProposal(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col gap-8 relative overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Vote className="text-blue-600" />
            Governance
          </h2>
          <p className="text-sm text-gray-400 mt-1">Vote on proposals and shape the future of SorobanFlow.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Create Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {proposals.map((p) => (
          <div 
            key={p.id} 
            onClick={() => setSelectedProposal(p)}
            className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-all group cursor-pointer active:bg-blue-50/30"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{p.title}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                p.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"
              }`}>
                {p.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gray-400" />
                <span>{p.votes} Votes</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span>{p.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vote Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedProposal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {voted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold">Vote Cast Successfully!</h3>
                <p className="text-gray-500 text-sm">Your vote has been recorded on the ledger.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Proposal Details</span>
                  <h3 className="text-xl font-bold mt-1 mb-2">{selectedProposal.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{selectedProposal.desc}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Current Votes</span>
                    <span className="text-lg font-bold">{selectedProposal.votes}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                    <span className="text-sm font-bold text-green-600">{selectedProposal.status}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleVote("for")}
                    disabled={voting || selectedProposal.status !== "Active"}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {voting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    VOTE FOR
                  </button>
                  <button 
                    onClick={() => handleVote("against")}
                    disabled={voting || selectedProposal.status !== "Active"}
                    className="w-full py-4 bg-white text-gray-500 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    VOTE AGAINST
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold">Proposal Submitted!</h3>
                <p className="text-gray-500 text-sm">Your proposal is now live for voting on the network.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">New Proposal</h3>
                  <p className="text-sm text-gray-400">Describe the change you want to see.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Proposal Title</label>
                    <input 
                      name="title"
                      type="text" 
                      placeholder="e.g. Upgrade Protocol to V21" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-medium outline-none focus:border-blue-200 transition-all"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</label>
                    <textarea 
                      placeholder="Detail your proposal here..." 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm font-medium outline-none focus:border-blue-200 transition-all min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  Submit Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
