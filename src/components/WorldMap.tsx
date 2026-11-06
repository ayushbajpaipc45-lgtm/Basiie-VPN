import React, { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { VpnServer } from '../types/vpn';
import { SERVERS_DATABASE } from '../data/servers';
import { Shield, Zap, Lock, Radio } from 'lucide-react';

interface WorldMapProps {
  onSelectServer?: (server: VpnServer) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onSelectServer }) => {
  const { selectedServer, status, connect } = useVpn();
  const [hoveredServer, setHoveredServer] = useState<VpnServer | null>(null);

  // User simulated origin (San Francisco)
  const origin = { x: 28.3, y: 35.8, city: 'San Francisco', country: 'United States' };
  const isConnected = status === 'connected';

  // Target destination node
  const dest = {
    x: selectedServer.coordinates.x,
    y: selectedServer.coordinates.y
  };

  // If double hop, entry node position
  const entryNodeServer = selectedServer.entryNode ? SERVERS_DATABASE.find(s => s.country.includes(selectedServer.entryNode!.country)) : null;

  // Arc path calculation for curved line
  const createCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    // Curve upwards proportional to distance
    const my = (y1 + y2) / 2 - Math.min(22, dist * 0.28);
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  };

  const handleServerClick = (server: VpnServer) => {
    if (onSelectServer) {
      onSelectServer(server);
    } else {
      connect(server);
    }
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden select-none">
      {/* Background Grid Pattern & Vignette */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.25) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />

      {/* Top Map Bar with Legend */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Global Zero-Knowledge Mesh</span>
          <span aria-hidden="true">·</span>
          <span>65+ RAM Nodes Active</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Optimal (Low Latency)</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Connected Tunnel</span>
          </div>
        </div>
      </div>

      {/* SVG Map Container */}
      <svg 
        viewBox="0 0 100 65" 
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="tunnelGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Simplified Vector Continental Outlines for lightweight world reference */}
        <g fill="none" stroke="#334155" strokeWidth="0.35" opacity="0.65">
          {/* North America */}
          <path d="M 12 10 Q 22 8 32 15 Q 38 22 34 32 Q 28 36 24 38 Q 20 45 16 38 Q 10 28 12 10 Z" />
          {/* South America */}
          <path d="M 28 42 Q 36 40 38 48 Q 36 60 30 62 Q 26 55 28 42 Z" />
          {/* Europe */}
          <path d="M 46 14 Q 54 12 58 18 Q 56 26 48 26 Q 44 20 46 14 Z" />
          {/* Africa */}
          <path d="M 46 28 Q 58 28 58 42 Q 54 56 48 54 Q 44 42 46 28 Z" />
          {/* Asia */}
          <path d="M 60 12 Q 80 12 88 24 Q 82 38 72 38 Q 60 34 60 12 Z" />
          {/* Australia / Oceania */}
          <path d="M 78 46 Q 88 44 90 52 Q 84 58 78 54 Z" />
        </g>

        {/* Active Encrypted Tunnel Arc */}
        {isConnected && (
          <g>
            {/* Soft Ambient Glow under line */}
            <path
              d={createCurvedPath(origin.x, origin.y, dest.x, dest.y)}
              fill="none"
              stroke="rgba(6, 182, 212, 0.25)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Core Animated Cyber Beam */}
            <path
              d={createCurvedPath(origin.x, origin.y, dest.x, dest.y)}
              fill="none"
              stroke="url(#tunnelGlow)"
              strokeWidth="0.65"
              strokeDasharray="2 1.5"
              strokeLinecap="round"
              className="animate-pulse"
              filter="url(#glow)"
            />
            
            {/* Origin Node Indicator */}
            <circle cx={origin.x} cy={origin.y} r="0.8" fill="#94a3b8" />
            <circle cx={origin.x} cy={origin.y} r="1.8" fill="none" stroke="#94a3b8" strokeWidth="0.2" opacity="0.6" />
          </g>
        )}

        {/* Server Nodes */}
        {SERVERS_DATABASE.map(server => {
          const isCurrent = server.id === selectedServer.id;
          const isDoubleHop = server.features.includes('double_vpn');

          return (
            <g 
              key={server.id} 
              className="cursor-pointer transition-transform duration-150 hover:scale-125"
              onMouseEnter={() => setHoveredServer(server)}
              onMouseLeave={() => setHoveredServer(null)}
              onClick={() => handleServerClick(server)}
            >
              {/* Pulsing ring if active connection */}
              {isCurrent && isConnected && (
                <>
                  <circle
                    cx={server.coordinates.x}
                    cy={server.coordinates.y}
                    r="2.5"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="0.3"
                    className="animate-ping"
                    opacity="0.8"
                  />
                  <circle
                    cx={server.coordinates.x}
                    cy={server.coordinates.y}
                    r="1.6"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="0.25"
                  />
                </>
              )}

              {/* Node Dot */}
              <circle
                cx={server.coordinates.x}
                cy={server.coordinates.y}
                r={isCurrent ? 1.0 : isDoubleHop ? 0.75 : 0.55}
                fill={
                  isCurrent && isConnected 
                    ? '#10b981' 
                    : isCurrent 
                      ? '#06b6d4' 
                      : isDoubleHop
                        ? '#a855f7'
                        : server.ping < 20 
                          ? '#22d3ee' 
                          : '#64748b'
                }
                stroke={isCurrent ? '#ffffff' : '#0f172a'}
                strokeWidth="0.25"
              />
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Info Card */}
      {hoveredServer && (
        <div 
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-xl backdrop-blur-md text-xs min-w-[190px]"
          style={{
            left: `${hoveredServer.coordinates.x}%`,
            top: `${hoveredServer.coordinates.y}%`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <span>{hoveredServer.flag}</span>
              <span>{hoveredServer.city}</span>
            </span>
            <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
              {hoveredServer.ping}ms
            </span>
          </div>

          <div className="text-[11px] text-slate-400 mb-1.5">
            {hoveredServer.country} · {hoveredServer.ip}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            <span>Load: <strong className="text-slate-200 font-mono tabular-nums">{hoveredServer.load}%</strong></span>
            <span className="text-cyan-400 font-medium">Click to connect</span>
          </div>
        </div>
      )}

      {/* Bottom Info Ribbon */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Origin: <span className="text-slate-200">{origin.city}, {origin.country}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>Exit Gateway:</span>
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <span>{selectedServer.flag}</span>
            <span>{selectedServer.city}, {selectedServer.country}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
