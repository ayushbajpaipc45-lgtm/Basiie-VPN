import React from 'react';
import { useVpn } from '../context/VpnContext';
import { Shield, Power, Monitor, Smartphone, Download, Settings, Activity } from 'lucide-react';

interface TopNavProps {
  onOpenServerModal: () => void;
  onOpenNoLogsModal: () => void;
  onOpenLeakTestModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDownloadsModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenServerModal,
  onOpenNoLogsModal,
  onOpenLeakTestModal,
  onOpenSettingsModal,
  onOpenDownloadsModal
}) => {
  const { status, toggleConnect, quickConnect, deviceView, setDeviceView, selectedServer } = useVpn();

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-sm shadow-cyan-500/20">
          <Shield className="w-4 h-4 fill-slate-950 stroke-slate-950" />
        </div>
        <a href="/" className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap">
          Badiie<span className="text-cyan-400">VPN</span>
        </a>
      </div>

      {/* Zone 2: 4-5 Single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button 
          onClick={onOpenServerModal}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          Servers ({selectedServer.city})
        </button>
        <button 
          onClick={onOpenNoLogsModal}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          Strict No-Logs Policy
        </button>
        <button 
          onClick={onOpenLeakTestModal}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          DNS Leak Test
        </button>
        <button 
          onClick={onOpenDownloadsModal}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          Apps & Configs
        </button>
        <button 
          onClick={onOpenSettingsModal}
          className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          Settings
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action + View Mode Switch */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Device Switcher (PC / Mobile Preview) */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setDeviceView('pc')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              deviceView === 'pc'
                ? 'bg-slate-800 text-slate-100 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop PC Client View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PC Client</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              deviceView === 'mobile'
                ? 'bg-slate-800 text-slate-100 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile Phone Simulator"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile App</span>
          </button>
        </div>

        {/* Primary Action Button: 1-Click Connect */}
        <button
          onClick={toggleConnect}
          disabled={isConnecting}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              : isConnecting
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold hover:shadow-cyan-500/20'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>
            {isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'One-Click Connect'}
          </span>
        </button>
      </div>
    </header>
  );
};
