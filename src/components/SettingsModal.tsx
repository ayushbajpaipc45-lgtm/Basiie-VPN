import React, { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { VpnProtocol } from '../types/vpn';
import { 
  Settings, 
  X, 
  Shield, 
  Cpu, 
  Lock, 
  Wifi, 
  Check, 
  Plus, 
  Trash2, 
  Sliders, 
  Radio, 
  AlertCircle 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    securitySettings, 
    updateSecuritySettings, 
    addSplitTunnelRule, 
    removeSplitTunnelRule 
  } = useVpn();

  const [activeTab, setActiveTab] = useState<'protocols' | 'killswitch' | 'splittunnel' | 'dns'>('protocols');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleValue, setNewRuleValue] = useState('');
  const [newRuleAction, setNewRuleAction] = useState<'bypass' | 'tunnel'>('bypass');

  if (!isOpen) return null;

  const protocols: { id: VpnProtocol; title: string; desc: string; cipher: string }[] = [
    {
      id: 'WireGuard',
      title: 'WireGuard® (Recommended)',
      desc: 'Next-gen protocol with state-of-the-art cryptography. Blazing fast throughput and instant connection recovery.',
      cipher: 'ChaCha20-Poly1305 · 256-bit AEAD'
    },
    {
      id: 'OpenVPN UDP',
      title: 'OpenVPN (UDP)',
      desc: 'Industry standard protocol optimized for high speed and streaming video.',
      cipher: 'AES-256-GCM · SHA-512'
    },
    {
      id: 'OpenVPN TCP',
      title: 'OpenVPN (TCP)',
      desc: 'Error-checking transmission protocol for heavily throttled or restrictive enterprise firewalls.',
      cipher: 'AES-256-GCM · TLS 1.3'
    },
    {
      id: 'IKEv2',
      title: 'IKEv2 / IPsec',
      desc: 'Optimized for mobile handshakes and rapid network switching between Wi-Fi and 5G cellular.',
      cipher: 'AES-256-CBC · Diffie-Hellman Group 20'
    },
    {
      id: 'Shadowsocks',
      title: 'Shadowsocks (Stealth Obfuscation)',
      desc: 'Disguises VPN traffic as standard HTTPS web browsing to defeat aggressive Deep Packet Inspection (DPI).',
      cipher: 'AEAD_CHACHA20 · Camouflage TCP'
    }
  ];

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleValue.trim()) return;
    addSplitTunnelRule({
      name: newRuleName.trim(),
      value: newRuleValue.trim(),
      type: newRuleValue.includes('.') && !newRuleValue.endsWith('.exe') ? 'domain' : 'app',
      action: newRuleAction
    });
    setNewRuleName('');
    setNewRuleValue('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Security & Network Configuration
              </h2>
              <div className="text-xs text-slate-400">
                Kernel-level encryption, DNS routing & tunnel governance
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('protocols')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'protocols'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            VPN Protocol
          </button>
          <button
            onClick={() => setActiveTab('killswitch')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'killswitch'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Kill Switch & Shield
          </button>
          <button
            onClick={() => setActiveTab('splittunnel')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'splittunnel'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Split Tunneling
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'dns'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            DNS & Ad Blocking
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Protocols */}
          {activeTab === 'protocols' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2">
                Choose the encryption algorithm and transport protocol matching your speed and network constraints.
              </div>
              <div className="space-y-2.5">
                {protocols.map((proto) => {
                  const isSelected = securitySettings.protocol === proto.id;
                  return (
                    <div
                      key={proto.id}
                      onClick={() => updateSecuritySettings({ protocol: proto.id })}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-cyan-950/20 border-cyan-500/50 text-slate-100 shadow-sm' 
                          : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </span>
                          <span>{proto.title}</span>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400/90 tabular-nums">
                          {proto.cipher}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pl-5">
                        {proto.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Kill Switch */}
          {activeTab === 'killswitch' && (
            <div className="space-y-5 text-xs">
              {/* Kill Switch Toggle */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Internet Kill Switch (System-Wide)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Instantly cuts all network traffic if the VPN connection drops unexpectedly, safeguarding your true IP address and sensitive data from leaking into the clear.
                  </p>
                </div>
                <button
                  onClick={() => updateSecuritySettings({ killSwitch: !securitySettings.killSwitch })}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    securitySettings.killSwitch ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    securitySettings.killSwitch ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Threat Protection Toggle */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Badiie CyberShield (Threat & Malware Filter)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Blocks intrusive advertisements, tracking beacons, phishing scams, and known botnet domains directly at the DNS resolver level before they reach your browser.
                  </p>
                </div>
                <button
                  onClick={() => updateSecuritySettings({ threatProtection: !securitySettings.threatProtection })}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    securitySettings.threatProtection ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    securitySettings.threatProtection ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Auto Connect on Untrusted Wi-Fi */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span>Auto-Protect on Public & Untrusted Wi-Fi</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Automatically engages the encrypted VPN tunnel the moment your device connects to unfamiliar open networks, airport Wi-Fi, or cafe hotspots.
                  </p>
                </div>
                <button
                  onClick={() => updateSecuritySettings({ autoConnectOnWifi: !securitySettings.autoConnectOnWifi })}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    securitySettings.autoConnectOnWifi ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    securitySettings.autoConnectOnWifi ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Split Tunneling */}
          {activeTab === 'splittunnel' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-100 text-sm">
                    Split Tunneling Rules
                  </div>
                  <div className="text-slate-400">
                    Route specific applications or IP ranges outside the encrypted tunnel.
                  </div>
                </div>
                <button
                  onClick={() => updateSecuritySettings({ splitTunnelingEnabled: !securitySettings.splitTunnelingEnabled })}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    securitySettings.splitTunnelingEnabled
                      ? 'bg-cyan-500 text-slate-950 font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {securitySettings.splitTunnelingEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Add New Rule Form */}
              <form onSubmit={handleAddRule} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-3">
                <div className="font-semibold text-slate-200">Add Rule or Exclusion</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Rule Label (e.g. Local Printer, Steam)"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="App or Domain (e.g. 192.168.1.0/24, netflix.com)"
                    value={newRuleValue}
                    onChange={(e) => setNewRuleValue(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={newRuleAction === 'bypass'}
                        onChange={() => setNewRuleAction('bypass')}
                        className="text-cyan-500"
                      />
                      <span>Bypass VPN</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={newRuleAction === 'tunnel'}
                        onChange={() => setNewRuleAction('tunnel')}
                        className="text-cyan-500"
                      />
                      <span>Only Through VPN</span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-md font-medium flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Rule</span>
                  </button>
                </div>
              </form>

              {/* Active Rules List */}
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
                {securitySettings.splitTunnelRules.map((rule) => (
                  <div key={rule.id} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-200">{rule.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{rule.value}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        rule.action === 'bypass'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {rule.action === 'bypass' ? 'Bypasses VPN' : 'Strict Tunnel'}
                      </span>
                      <button
                        onClick={() => removeSplitTunnelRule(rule.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Delete rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DNS */}
          {activeTab === 'dns' && (
            <div className="space-y-3 text-xs">
              <div className="text-slate-400 mb-2">
                All DNS lookups are encrypted and resolved without third-party exposure.
              </div>
              {[
                { id: 'aegis', name: 'Badiie Zero-Knowledge In-Memory DNS (Recommended)', desc: 'Zero logging, hosted on the same RAM-only servers. 100% leak proof.', ip: '10.66.0.1' },
                { id: 'cloudflare', name: 'Cloudflare Privacy Resolver', desc: 'Fast, secure public resolver with APNIC peering.', ip: '1.1.1.1 / 1.0.0.1' },
                { id: 'quad9', name: 'Quad9 Security DNS', desc: 'Blocks malicious domains via threat intelligence feeds.', ip: '9.9.9.9' },
                { id: 'custom', name: 'Custom DNS Server', desc: 'Specify your own dedicated private DNS resolver.', ip: 'Custom IPv4' }
              ].map((dns) => {
                const isSelected = securitySettings.customDns === dns.id;
                return (
                  <div
                    key={dns.id}
                    onClick={() => updateSecuritySettings({ customDns: dns.id as any })}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-cyan-950/20 border-cyan-500/50 text-slate-100 shadow-sm' 
                        : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </span>
                        <span>{dns.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-cyan-400/90">{dns.ip}</span>
                    </div>
                    <p className="text-slate-400 mt-1 pl-5">{dns.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Settings persist automatically in local device store</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
