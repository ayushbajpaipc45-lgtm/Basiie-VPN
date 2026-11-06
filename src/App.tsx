/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VpnProvider, useVpn } from './context/VpnContext';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { MobileSimulator } from './components/MobileSimulator';
import { ServerListModal } from './components/ServerListModal';
import { NoLogsPolicyModal } from './components/NoLogsPolicyModal';
import { LeakTestModal } from './components/LeakTestModal';
import { SettingsModal } from './components/SettingsModal';
import { ClientDownloadsModal } from './components/ClientDownloadsModal';
import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';

const VpnMainLayout: React.FC = () => {
  const { deviceView, setDeviceView, selectedServer, status } = useVpn();

  // Modals state
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isNoLogsModalOpen, setIsNoLogsModalOpen] = useState(false);
  const [isLeakTestModalOpen, setIsLeakTestModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation adhering to 3-Zone contract */}
      <TopNav
        onOpenServerModal={() => setIsServerModalOpen(true)}
        onOpenNoLogsModal={() => setIsNoLogsModalOpen(true)}
        onOpenLeakTestModal={() => setIsLeakTestModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenDownloadsModal={() => setIsDownloadsModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        {deviceView === 'pc' ? (
          <DashboardView
            onOpenServerModal={() => setIsServerModalOpen(true)}
            onOpenNoLogsModal={() => setIsNoLogsModalOpen(true)}
            onOpenLeakTestModal={() => setIsLeakTestModalOpen(true)}
            onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            onOpenDownloadsModal={() => setIsDownloadsModalOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between max-w-md mx-auto px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Mobile Device Interactive Simulator
              </span>
              <button
                onClick={() => setDeviceView('pc')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Switch to PC View
              </button>
            </div>
            
            <MobileSimulator
              onOpenServerModal={() => setIsServerModalOpen(true)}
              onOpenNoLogsModal={() => setIsNoLogsModalOpen(true)}
              onOpenLeakTestModal={() => setIsLeakTestModalOpen(true)}
              onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200">Badiie VPN</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Knowledge Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Zurich, Switzerland</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsNoLogsModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              No-Logs Transparency
            </button>
            <button
              onClick={() => setIsLeakTestModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              DNS Integrity
            </button>
            <button
              onClick={() => setIsDownloadsModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              WireGuard Profiles
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Kill Switch
            </button>
          </div>
        </div>
      </footer>

      {/* Modal Dialogs */}
      <ServerListModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />

      <NoLogsPolicyModal
        isOpen={isNoLogsModalOpen}
        onClose={() => setIsNoLogsModalOpen(false)}
      />

      <LeakTestModal
        isOpen={isLeakTestModalOpen}
        onClose={() => setIsLeakTestModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <ClientDownloadsModal
        isOpen={isDownloadsModalOpen}
        onClose={() => setIsDownloadsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <VpnProvider>
      <VpnMainLayout />
    </VpnProvider>
  );
}
