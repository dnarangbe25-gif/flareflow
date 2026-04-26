"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, Wallet, LogOut } from "lucide-react";
import { useWalletContext } from "@/context/WalletContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address, connect, disconnect, isConnecting } = useWalletContext();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleConnect = async () => {
    console.log("Header: handleConnect called");
    try {
      await connect();
    } catch (e) {
      console.error("Header: connect failed", e);
    }
  };

  return (
    <nav className="w-full border-b border-gray-100 bg-white px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-black tracking-tighter text-black flex items-center gap-2">
            FLARE <span className="text-amber-500">FLOW</span>
          </h1>
        </Link>

        {/* Middle: Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {[
            { name: "Swap", href: "/dashboard#swap" },
            { name: "Liquidity", href: "/dashboard#liquidity" },
            { name: "Governance", href: "/dashboard#governance" }
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2">
          {/* Wallet / Launch Button */}
          {pathname === "/" ? (
            <Link href="/dashboard" className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-all shadow-sm">
              LAUNCH APP
            </Link>
          ) : (
            <button 
              onClick={address ? undefined : handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-3 py-1.5 border border-amber-200 rounded-lg text-[10px] sm:text-xs font-bold text-amber-700 bg-amber-50/50 hover:bg-amber-50 transition-all cursor-pointer relative z-50"
            >
              <Wallet size={12} />
              <span className="hidden sm:inline">
                {isConnecting ? "..." : address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Connect"}
              </span>
              <span className="sm:inline hidden ml-1">WALLET</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="hidden sm:flex p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-all"
          >
            {theme === "light" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Disconnect Button */}
          {address && (
            <button 
              onClick={disconnect}
              className="hidden sm:flex p-1.5 border border-gray-200 rounded-lg text-red-400 hover:bg-red-50 hover:border-red-100 transition-all"
              title="Disconnect"
            >
              <LogOut size={14} />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1.5 border border-gray-200 rounded-lg text-gray-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-2 flex flex-col space-y-3 border-t border-gray-50 mt-4">
          {[
            { name: "Swap", href: "/dashboard#swap" },
            { name: "Liquidity", href: "/dashboard#liquidity" },
            { name: "Governance", href: "/dashboard#governance" }
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {/* Mobile Utility Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-medium text-gray-500"
            >
              {theme === "light" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </button>
            {address && (
              <button 
                onClick={disconnect}
                className="flex items-center gap-2 text-sm font-medium text-red-400"
              >
                <LogOut size={14} />
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
