"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4 glass-card border-red-500/20">
          <div className="p-4 rounded-full bg-red-500/10 text-red-500">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-slate-500 max-w-md">
            {this.state.error?.message || "An unexpected error occurred while interacting with Soroban."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <RotateCcw size={18} />
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.children;
  }
}
