import React, { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { WorldMap } from './WorldMap';
import { SERVERS_DATABASE } from '../data/servers';
import { VpnServer } from '../types/vpn';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Power, 
  ArrowDown, 
  ArrowUp, 
  Lock, 
  Wifi, 
  Globe, 
  Zap, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Clock,
  HardDriveDownload,
  HardDriveUpload,
  Activity,
  Layers,
  ChevronRight,
  EyeOff
} from 'lucide-react';

interface DashboardViewProps {
  onOpenServerModal: () => void;
  onOpenNoLogsModal: () => void;
  onOpenLeakTestModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDownloadsModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenServerModal,
  onOpenNoLogsModal,
  onOpenLeakTestModal,
  onOpenSettingsModal,
  onOpenDownloadsModal
}) => {
  const { 
    status, 
    selectedServer, 
    setSelectedServer, 
    connect, 
    toggleConnect, 
    quickConnect, 
    metrics, 
    handshakeStep,
    securitySettings,
    updateSecuritySettings,
    realUserIp 
  } = useVpn();

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';
  const isDisconnecting = status === 'disconnecting';

  // Format active session duration
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format data transferred in MB or GB
  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Top fastest recommended servers
  const recommendedServers = SERVERS_DATABASE.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Status & Quick Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isConnected 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
          }`}>
            {isConnected ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Security & Privacy Posture
            </div>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-2 flex-wrap">
              {isConnected ? (
                <>
                  <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Fully Unexposed & 256-Bit Encrypted
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300 font-mono">
                    Virtual Gateway: {selectedServer.ip} ({selectedServer.city}, {selectedServer.country})
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-[11px] text-cyan-300 font-medium">
                    0/6 Exposure Vectors Exposed
                  </span>
                </>
              ) : (
                <>
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Exposed (Unencrypted)
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    Real IP: {realUserIp.ip} ({realUserIp.city}, {realUserIp.country})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={quickConnect}
            disabled={isConnecting}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optimal Quick Connect</span>
          </button>
          <button
            onClick={onOpenNoLogsModal}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700/60"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Logs Audit</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Control Panel (Left) & World Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: One-Click Connection Hub (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          
          {/* Header of Hub */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Connection Master
            </span>
            <span className="text-xs font-mono text-cyan-400 tabular-nums">
              {securitySettings.protocol}
            </span>
          </div>

          {/* Big Tactile One-Click Power Button */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative">
              {/* Outer Ambient Glow ring */}
              {isConnected && (
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              )}
              {isConnecting && (
                <div className="absolute -inset-4 rounded-full bg-cyan-500/20 blur-xl animate-spin" />
              )}

              <button
                onClick={toggleConnect}
                disabled={isConnecting || isDisconnecting}
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 relative z-10 border-4 cursor-pointer ${
                  isConnected
                    ? 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-400 text-white shadow-emerald-500/30 hover:scale-[1.02]'
                    : isConnecting
                      ? 'bg-slate-800 border-cyan-400 text-cyan-400 animate-pulse'
                      : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white shadow-slate-950/70 hover:scale-[1.02]'
                }`}
                aria-label="One-click connect toggle"
              >
                <Power className={`w-14 h-14 transition-transform duration-200 ${
                  isConnected ? 'scale-110 text-white' : 'text-slate-400'
                }`} />
                <span className="text-xs font-bold tracking-wider uppercase mt-2">
                  {isConnected ? 'Disconnect' : isConnecting ? 'Connecting' : 'One-Click Connect'}
                </span>
                <span className="text-[10px] text-slate-200/80 font-mono mt-0.5">
                  {isConnected ? formatDuration(metrics.durationSeconds) : 'Instant Secure'}
                </span>
              </button>
            </div>

            {/* Handshake Progress Message */}
            {isConnecting && (
              <div className="mt-4 text-xs font-medium text-cyan-400 animate-pulse flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>{handshakeStep || 'Establishing zero-knowledge tunnel...'}</span>
              </div>
            )}
            {!isConnecting && !isConnected && (
              <div className="mt-4 text-xs text-slate-400">
                Click to activate military-grade 256-bit encryption tunnel
              </div>
            )}
            {isConnected && (
              <div className="mt-4 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fully Unexposed & Encrypted · Zero-Logs RAM Tunnel Active</span>
              </div>
            )}
          </div>

          {/* Selected Gateway Location Box */}
          <div 
            onClick={onOpenServerModal}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-950/80 cursor-pointer transition-colors"
          >
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
              <span>Selected Server Gateway</span>
              <span className="text-cyan-400 flex items-center gap-0.5 hover:underline">
                <span>Change Server</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label={selectedServer.country}>
                  {selectedServer.flag}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{selectedServer.city}</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({selectedServer.country})
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {isConnected ? selectedServer.ip : 'Virtual IP masked on connect'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-slate-200 flex items-center justify-end gap-1">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>{selectedServer.ping} ms</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedServer.load}% server load
                </div>
              </div>
            </div>
          </div>

          {/* Quick 4 Server Selection Pills */}
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Fastest Available Nodes
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recommendedServers.map((srv) => {
                const isActive = srv.id === selectedServer.id;
                return (
                  <button
                    key={srv.id}
                    onClick={() => {
                      setSelectedServer(srv);
                      if (isConnected) connect(srv);
                    }}
                    className={`p-2 rounded-lg text-left flex items-center justify-between text-xs border transition-colors ${
                      isActive
                        ? 'bg-cyan-950/30 border-cyan-500/50 text-slate-100'
                        : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{srv.flag}</span>
                      <span className="truncate font-medium">{srv.city}</span>
                    </div>
                    <span className="text-[11px] font-mono text-cyan-400 shrink-0">
                      {srv.ping}ms
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Global Mesh Map & Network Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          {/* Interactive World Map */}
          <div className="rounded-xl overflow-hidden shadow-xl border border-slate-800">
            <WorldMap onSelectServer={(srv) => {
              setSelectedServer(srv);
              if (isConnected) connect(srv);
            }} />
          </div>

          {/* Real-Time Telemetry Bar (4-col strip) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Speed</span>
              </div>
              <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
                {isConnected ? `${metrics.downloadSpeedMbps} Mbps` : '0 Mbps'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Total: {formatBytes(metrics.bytesReceived)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Upload Speed</span>
              </div>
              <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
                {isConnected ? `${metrics.uploadSpeedMbps} Mbps` : '0 Mbps'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Total: {formatBytes(metrics.bytesSent)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Cipher Suite</span>
              </div>
              <div className="text-xs font-bold font-mono text-slate-200 mt-1 truncate" title={metrics.encryptionCipher}>
                {metrics.encryptionCipher.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                256-bit Ephemeral Key
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Session Duration</span>
              </div>
              <div className="text-base font-bold font-mono text-slate-100 mt-1 tabular-nums">
                {formatDuration(metrics.durationSeconds)}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                {isConnected ? 'Packet loss: 0.0%' : 'Disconnected'}
              </div>
            </div>
          </div>

          {/* Quick Security Guard Matrix */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${securitySettings.killSwitch ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                <span className="text-slate-300 font-medium">Kill Switch:</span>
                <span className="text-slate-400">{securitySettings.killSwitch ? 'Active' : 'Disabled'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${securitySettings.threatProtection ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                <span className="text-slate-300 font-medium">CyberShield:</span>
                <span className="text-slate-400">{securitySettings.threatProtection ? 'Filtering Ads & Malware' : 'Disabled'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-slate-300 font-medium">RAM-Only Nodes:</span>
                <span className="text-slate-400">100% Volatile</span>
              </div>
            </div>

            <button
              onClick={onOpenSettingsModal}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 ml-auto"
            >
              <span>Configure Shields</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Feature Storytelling / Trust Proof Strip (Strict Anti-Slop adherence) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div 
          onClick={onOpenNoLogsModal}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="font-semibold text-sm text-slate-100 flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict No-Logs Architecture</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero logs, zero metadata, and zero connection timestamps. Backed by independently audited diskless RAM-only servers.
          </p>
        </div>

        <div 
          onClick={onOpenLeakTestModal}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="font-semibold text-sm text-slate-100 flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Leak Diagnostic</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verify your true IP address masking, DNS leak protection, WebRTC blocking, and IPv6 clamping right in the app.
          </p>
        </div>

        <div 
          onClick={onOpenDownloadsModal}
          className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="font-semibold text-sm text-slate-100 flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Cross-Platform Ready</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Download native client binaries or export standard RFC-compliant WireGuard & OpenVPN profiles with QR codes for mobile.
          </p>
        </div>
      </div>
    </div>
  );
};
