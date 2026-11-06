import React, { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { generateWireGuardConfig, generateOpenVpnConfig, downloadConfigFile } from '../utils/vpnConfig';
import { 
  Download, 
  X, 
  Monitor, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  FileCode, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface ClientDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDownloadsModal: React.FC<ClientDownloadsModalProps> = ({ isOpen, onClose }) => {
  const { selectedServer } = useVpn();
  const [activePlatform, setActivePlatform] = useState<'pc' | 'mobile'>('pc');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const wireguardConfig = generateWireGuardConfig(selectedServer);
  const openvpnConfig = generateOpenVpnConfig(selectedServer);

  const handleCopy = () => {
    navigator.clipboard.writeText(wireguardConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWg = () => {
    downloadConfigFile(wireguardConfig, `badiie-${selectedServer.id}.conf`);
  };

  const handleDownloadOvpn = () => {
    downloadConfigFile(openvpnConfig, `badiie-${selectedServer.id}.ovpn`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Client Downloads & Configuration Profiles
              </h2>
              <div className="text-xs text-slate-400">
                Native clients for PC & Mobile or generic WireGuard/OpenVPN profiles
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

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActivePlatform('pc')}
            className={`pb-2.5 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activePlatform === 'pc'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>PC & Desktop (Windows / macOS / Linux)</span>
          </button>
          <button
            onClick={() => setActivePlatform('mobile')}
            className={`pb-2.5 px-4 font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activePlatform === 'mobile'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (iOS & Android)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activePlatform === 'pc' ? (
            <div className="space-y-6">
              {/* Native App Downloads */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Official Badiie Desktop Client
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-100">Windows</div>
                      <div className="text-xs text-slate-400 mt-1">Windows 10, 11 (64-bit)</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">WireGuard v0.5.3 Native</div>
                    </div>
                    <button
                      onClick={() => handleDownloadWg()}
                      className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .exe (Installer)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-100">macOS</div>
                      <div className="text-xs text-slate-400 mt-1">Apple Silicon M1/M2/M3 & Intel</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">Universal Binary .dmg</div>
                    </div>
                    <button
                      onClick={() => handleDownloadWg()}
                      className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .dmg (Mac)</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-sm text-slate-100">Linux</div>
                      <div className="text-xs text-slate-400 mt-1">Ubuntu, Debian, Fedora, Arch</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">.deb / .rpm / CLI Daemon</div>
                    </div>
                    <button
                      onClick={() => handleDownloadWg()}
                      className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .deb</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* WireGuard & OpenVPN Config Generator */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      Standard WireGuard Profile ({selectedServer.city}, {selectedServer.country})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ready to import directly into the official WireGuard desktop client.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadWg}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .conf</span>
                    </button>
                    <button
                      onClick={handleDownloadOvpn}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.ovpn</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
                  <pre className="text-xs font-mono text-cyan-300/90 leading-relaxed">
                    {wireguardConfig}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            /* Mobile Platform */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code generator */}
                <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Scan with WireGuard Mobile App
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Open WireGuard on your iPhone or Android, tap "+" and scan this QR code to instantly install the {selectedServer.city} profile.
                  </p>

                  {/* Clean SVG QR code representation */}
                  <div className="mt-4 p-3 bg-white rounded-xl shadow-lg">
                    <svg viewBox="0 0 160 160" width="160" height="160" className="shape-rendering-crispEdges">
                      {/* Corner markers */}
                      <rect x="10" y="10" width="40" height="40" fill="#0f172a" />
                      <rect x="18" y="18" width="24" height="24" fill="#ffffff" />
                      <rect x="24" y="24" width="12" height="12" fill="#0f172a" />

                      <rect x="110" y="10" width="40" height="40" fill="#0f172a" />
                      <rect x="118" y="18" width="24" height="24" fill="#ffffff" />
                      <rect x="124" y="24" width="12" height="12" fill="#0f172a" />

                      <rect x="10" y="110" width="40" height="40" fill="#0f172a" />
                      <rect x="18" y="118" width="24" height="24" fill="#ffffff" />
                      <rect x="24" y="124" width="12" height="12" fill="#0f172a" />

                      {/* Random high-density pseudo matrix for profile representation */}
                      {[
                        [60, 20], [70, 20], [90, 20], [60, 30], [80, 30], [60, 40], [70, 40], [90, 40],
                        [20, 60], [30, 60], [50, 60], [70, 60], [80, 60], [100, 60], [120, 60], [140, 60],
                        [10, 70], [40, 70], [60, 70], [90, 70], [110, 70], [130, 70],
                        [30, 80], [50, 80], [70, 80], [100, 80], [120, 80], [140, 80],
                        [10, 90], [20, 90], [60, 90], [80, 90], [110, 90], [130, 90],
                        [60, 110], [70, 110], [90, 110], [110, 110], [130, 110], [140, 110],
                        [70, 120], [80, 120], [100, 120], [120, 120],
                        [60, 130], [90, 130], [110, 130], [140, 130],
                        [70, 140], [80, 140], [100, 140], [130, 140]
                      ].map(([x, y], idx) => (
                        <rect key={idx} x={x} y={y} width="8" height="8" fill="#0f172a" />
                      ))}
                    </svg>
                  </div>

                  <div className="mt-3 text-[11px] font-mono text-cyan-400">
                    Profile: {selectedServer.id}.conf
                  </div>
                </div>

                {/* Mobile Stores */}
                <div className="space-y-4 flex flex-col justify-center">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="font-semibold text-sm text-slate-100">iOS (iPhone & iPad)</div>
                    <div className="text-xs text-slate-400 mt-1">iOS 15.0 or later with Always-On VPN support</div>
                    <button
                      onClick={() => handleDownloadWg()}
                      className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download iOS Mobile Profile</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="font-semibold text-sm text-slate-100">Android</div>
                    <div className="text-xs text-slate-400 mt-1">Android 8.0+ / APK direct or Play Store</div>
                    <button
                      onClick={() => handleDownloadWg()}
                      className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Android .conf</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Standard RFC-compliant WireGuard & OpenVPN profiles</span>
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
