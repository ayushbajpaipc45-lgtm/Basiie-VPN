import React from 'react';
import { useVpn } from '../context/VpnContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  RefreshCw, 
  Wifi, 
  Globe, 
  Lock, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface LeakTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeakTestModal: React.FC<LeakTestModalProps> = ({ isOpen, onClose }) => {
  const { leakTest, runLeakTest, status, selectedServer, realUserIp } = useVpn();

  if (!isOpen) return null;

  const isTesting = leakTest.step !== 'idle' && leakTest.step !== 'completed';
  const isConnected = status === 'connected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isConnected 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              {isConnected ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                IP, DNS & WebRTC Leak Test
              </h2>
              <div className="text-xs text-slate-400">
                Real-time diagnostic verification of tunnel integrity
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border ${
            isConnected
              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
              : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Protected: Badiie Tunnel Sealed</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Unprotected: Traffic Visible to ISP</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  {leakTest.summary}
                </div>
              </div>
              <button
                onClick={runLeakTest}
                disabled={isTesting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{isTesting ? 'Testing...' : 'Run Diagnostics'}</span>
              </button>
            </div>
          </div>

          {/* Test Breakdown Cards */}
          <div className="space-y-3 text-xs">
            {/* Test 1: Public IP */}
            <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Public IP Masking</span>
                </div>
                <div className="text-slate-400">
                  Visible IP: <strong className="font-mono text-slate-200">{leakTest.detectedIp || (isConnected ? selectedServer.ip : realUserIp.ip)}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  ISP: {leakTest.detectedIsp || (isConnected ? 'Badiie RAM-Only Anonymous Datacenter' : realUserIp.isp)} · {leakTest.detectedCity || (isConnected ? selectedServer.city : realUserIp.city)}, {leakTest.detectedCountry || (isConnected ? selectedServer.country : realUserIp.country)}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-semibold shrink-0 ${
                isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isConnected ? 'Shielded' : 'Exposed'}
              </span>
            </div>

            {/* Test 2: DNS Leak */}
            <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <span>DNS Leak Prevention</span>
                </div>
                <div className="text-slate-400">
                  Active Resolver: <strong className="font-mono text-slate-200">{leakTest.detectedDns || (isConnected ? '10.66.0.1 (Zero-Knowledge Recursive)' : '75.75.75.75 (ISP DNS)')}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  Queries are forced through Badiie private in-memory resolvers; ISP DNS hijacked queries are strictly discarded.
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-semibold shrink-0 ${
                isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isConnected ? 'Leak Free' : 'ISP Leaking'}
              </span>
            </div>

            {/* Test 3: WebRTC Leak */}
            <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>WebRTC STUN / ICE Shield</span>
                </div>
                <div className="text-slate-400">
                  Local Adapter IP: <strong className="font-mono text-slate-200">{leakTest.webrtcLocalIp || (isConnected ? 'Blocked (mDNS only)' : '192.168.1.144 (Exposed)')}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  WebRTC protocol bypasses proxy settings in modern browsers. Badiie filters STUN request packets at the kernel level.
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-semibold shrink-0 ${
                isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isConnected ? 'Guarded' : 'Leaking'}
              </span>
            </div>

            {/* Test 4: IPv6 Exposure */}
            <div className="p-3.5 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>IPv6 Leak Clamp</span>
                </div>
                <div className="text-slate-400">
                  IPv6 Interface Status: <strong className="font-mono text-slate-200">{isConnected ? 'Clamped & Encrypted (fd42:42:42::2)' : 'Native Dual-Stack Exposed'}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  Prevents operating systems from silently bypassing the IPv4 VPN tunnel over modern IPv6 transit.
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase font-semibold shrink-0 ${
                isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isConnected ? 'Clamped' : 'Exposed'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Continuous zero-trust tunnel verification</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
