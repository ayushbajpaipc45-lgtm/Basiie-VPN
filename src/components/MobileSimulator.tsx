import React, { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { 
  Shield, 
  Power, 
  Wifi, 
  ArrowDown, 
  ArrowUp, 
  ChevronRight, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  Lock, 
  Activity,
  Battery,
  Signal,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface MobileSimulatorProps {
  onOpenServerModal: () => void;
  onOpenNoLogsModal: () => void;
  onOpenLeakTestModal: () => void;
  onOpenSettingsModal: () => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  onOpenServerModal,
  onOpenNoLogsModal,
  onOpenLeakTestModal,
  onOpenSettingsModal
}) => {
  const { 
    status, 
    selectedServer, 
    toggleConnect, 
    metrics, 
    handshakeStep,
    securitySettings,
    updateSecuritySettings,
    realUserIp 
  } = useVpn();

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const isDisconnecting = status === 'disconnecting';

  // Format active duration
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Phone Case Shell */}
      <div className="w-[360px] sm:w-[380px] h-[740px] bg-slate-950 rounded-[48px] p-3 border-[6px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-2 px-2 shadow-inner border border-slate-800/80">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/30" />
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-slate-900 rounded-[38px] flex flex-col overflow-hidden relative border border-slate-800/60 select-none">
          
          {/* iOS / Android Status Bar */}
          <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-medium z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Top Bar */}
          <div className="px-5 py-2.5 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-100">Badiie Mobile</span>
            </div>
            <button 
              onClick={onOpenSettingsModal}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Main Mobile Screen Body */}
          <div className="flex-1 px-5 flex flex-col justify-between py-2 overflow-y-auto">
            
            {/* Connection Status Text */}
            <div className="text-center pt-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {isConnected 
                  ? 'Fully Unexposed & Encrypted' 
                  : isConnecting 
                    ? 'Establishing Tunnel' 
                    : isDisconnecting
                      ? 'Disconnecting'
                      : 'Unprotected'}
              </div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">
                {isConnected ? (
                  <span className="text-emerald-400 font-mono tabular-nums">
                    {formatTime(metrics.durationSeconds)}
                  </span>
                ) : isConnecting ? (
                  <span className="text-xs text-cyan-400 animate-pulse block truncate">
                    {handshakeStep || 'Negotiating keys...'}
                  </span>
                ) : (
                  'Not Connected'
                )}
              </div>
            </div>

            {/* Giant Tactile One-Tap Power Dial */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative">
                {/* Outer Glow Ring when Connected */}
                {isConnected && (
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-md animate-pulse" />
                )}
                {isConnecting && (
                  <div className="absolute -inset-4 rounded-full bg-cyan-500/20 blur-md animate-spin" />
                )}

                <button
                  onClick={toggleConnect}
                  disabled={isConnecting || isDisconnecting}
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 relative z-10 border-4 ${
                    isConnected
                      ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-400 text-white shadow-emerald-500/30'
                      : isConnecting
                        ? 'bg-slate-800 border-cyan-400 text-cyan-400 animate-pulse'
                        : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white shadow-slate-950/60'
                  }`}
                  aria-label="One-tap connect"
                >
                  <Power className={`w-12 h-12 transition-transform duration-200 ${
                    isConnected ? 'scale-110 text-white' : 'text-slate-400'
                  }`} />
                  <span className="text-xs font-bold tracking-wider uppercase mt-1">
                    {isConnected ? 'Disconnect' : isConnecting ? 'Connecting' : 'Quick Connect'}
                  </span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Strict Zero-Logs · RAM Only</span>
              </div>
            </div>

            {/* Selected Server Drawer Card (Click to open server list) */}
            <div 
              onClick={onOpenServerModal}
              className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={selectedServer.country}>
                    {selectedServer.flag}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{selectedServer.city}</span>
                      <span className="text-[10px] text-slate-400">({selectedServer.country})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {isConnected ? selectedServer.ip : 'Tap to change country'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-cyan-400 tabular-nums">
                      {selectedServer.ping}ms
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {selectedServer.load}% load
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Live Metrics Mini Bar */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ArrowDown className="w-3 h-3 text-cyan-400" /> Download
                </div>
                <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5 tabular-nums">
                  {isConnected ? `${metrics.downloadSpeedMbps} Mbps` : '0 Mbps'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3 text-emerald-400" /> Upload
                </div>
                <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5 tabular-nums">
                  {isConnected ? `${metrics.uploadSpeedMbps} Mbps` : '0 Mbps'}
                </div>
              </div>
            </div>

            {/* Mobile Quick Toggles */}
            <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl mt-2 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-[11px]">Kill Switch</span>
                <button
                  onClick={() => updateSecuritySettings({ killSwitch: !securitySettings.killSwitch })}
                  className={`w-9 h-4.5 rounded-full relative transition-colors p-0.5 ${
                    securitySettings.killSwitch ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform ${
                    securitySettings.killSwitch ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-[11px]">Threat & Ad Blocker</span>
                <button
                  onClick={() => updateSecuritySettings({ threatProtection: !securitySettings.threatProtection })}
                  className={`w-9 h-4.5 rounded-full relative transition-colors p-0.5 ${
                    securitySettings.threatProtection ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-slate-950 transition-transform ${
                    securitySettings.threatProtection ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

          </div>

          {/* Mobile Bottom Navigation Bar */}
          <div className="px-4 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-around text-[10px] text-slate-400 z-20">
            <button 
              className="flex flex-col items-center gap-1 text-cyan-400 font-semibold"
            >
              <Shield className="w-4 h-4" />
              <span>Connect</span>
            </button>
            <button 
              onClick={onOpenServerModal}
              className="flex flex-col items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Locations</span>
            </button>
            <button 
              onClick={onOpenLeakTestModal}
              className="flex flex-col items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Leak Test</span>
            </button>
            <button 
              onClick={onOpenNoLogsModal}
              className="flex flex-col items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Privacy</span>
            </button>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="pb-1 flex justify-center bg-slate-950">
            <div className="w-28 h-1 rounded-full bg-slate-700" />
          </div>

        </div>
      </div>
    </div>
  );
};
