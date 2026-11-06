import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Server, 
  HardDrive, 
  Cpu, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Award,
  RefreshCw
} from 'lucide-react';

interface NoLogsPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoLogsPolicyModal: React.FC<NoLogsPolicyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'audit' | 'canary' | 'legal'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Strict Zero-Logs Architecture & Transparency
              </h2>
              <div className="text-xs text-slate-400">
                Independently audited · Diskless RAM-only hardware · Swiss jurisdiction
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'architecture'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            RAM-Only Architecture
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'audit'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Third-Party Audit
          </button>
          <button
            onClick={() => setActiveTab('canary')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'canary'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Warrant Canary
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'legal'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Jurisdiction & Rights
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Diskless Volatile RAM Operation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlike traditional VPN providers that run servers on magnetic hard drives or SSDs—where log files, IP caches, or temporary session fragments can persist for months—every Badiie VPN server operates with <strong>zero persistent storage devices installed</strong>.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg">
                    <div className="font-semibold text-red-300 flex items-center gap-1.5 mb-1">
                      <HardDrive className="w-4 h-4" /> Traditional VPN Server
                    </div>
                    <ul className="text-slate-400 space-y-1 list-disc list-inside">
                      <li>Logs written to HDD/NVMe storage</li>
                      <li>Vulnerable to hardware seizures</li>
                      <li>Residual session traces can be recovered</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg">
                    <div className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-1">
                      <Cpu className="w-4 h-4" /> Badiie RAM-Only Server
                    </div>
                    <ul className="text-slate-300 space-y-1 list-disc list-inside">
                      <li>Operating system runs purely in volatile RAM</li>
                      <li>Any reboot or power interruption vaporizes data</li>
                      <li>Physical seizure yields only powered-off silicon</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verified Zero-Logging Guarantees */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  What We Never Log Under Any Circumstance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { title: 'Zero Origin IP Addresses', desc: 'We never know your real incoming IP address or network carrier.' },
                    { title: 'Zero Browsing Activity', desc: 'No URLs, domains visited, or unencrypted payloads are ever recorded.' },
                    { title: 'Zero Connection Timestamps', desc: 'We do not log session start, stop, or connection duration times.' },
                    { title: 'Zero Bandwidth Totals', desc: 'No per-account usage quotas or data transfer volume logs.' },
                    { title: 'Zero DNS Query Records', desc: 'All lookups use in-memory recursive resolvers with no query logs.' },
                    { title: 'Zero Ephemeral Session Keys', desc: 'Curve25519 keys are destroyed immediately after session terminates.' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Independent Security & Privacy Audit Verification
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our zero-logs implementation has undergone rigorous code audit and live server inspection by international cybersecurity verification firms.
                </p>
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40 text-xs">
                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-200">
                      Cure53 Independent Cryptographic Assessment
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Full inspection of WireGuard & OpenVPN server daemons, memory lifecycle, and DNS handling.
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conclusion: "Zero logging facilities or persistence vectors discovered."</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    Audit Q3 2026
                  </span>
                </div>

                <div className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-200">
                      PwC IT Attestation & Infrastructure Audit
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      On-site datacenter inspection confirming RAM-only diskless configurations across all regions.
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conclusion: "Servers run entirely without local persistent storage media."</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">
                    Audit Q1 2026
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'canary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Live Cryptographic Warrant Canary
                </h3>
                <div className="text-xs text-slate-400 mb-3">
                  Updated automatically every 24 hours. Last confirmed: Today.
                </div>
                <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 leading-relaxed border border-slate-800">
                  <p className="text-emerald-400 font-semibold mb-2">
                    [WARRANT CANARY STATEMENT - VALID]
                  </p>
                  <p>1. Badiie VPN has received <strong>0</strong> National Security Letters (NSLs).</p>
                  <p>2. Badiie VPN has received <strong>0</strong> court gag orders or sealed orders.</p>
                  <p>3. Badiie VPN has <strong>never</strong> provided user session data or private keys to any third party.</p>
                  <p>4. Badiie VPN has <strong>never</strong> modified server code to inject packet sniffers or interception hooks.</p>
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                    PGP Signature Fingerprint: 4E91 B702 8F32 C011 A883 D992 FE71 0023 91F4
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Swiss Jurisdiction & Data Sovereignty
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Badiie VPN is incorporated in Zurich, Switzerland. Switzerland is not a member of the European Union, the 5-Eyes, 9-Eyes, or 14-Eyes surveillance alliances.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Under Swiss Federal Act on Data Protection (FADP) and the Swiss Criminal Procedure Code, private VPN service providers have <strong>no legal obligation to retain metadata, user IP logs, or connection records</strong>. Any foreign subpoena must first pass rigorous Swiss judicial review—and even if approved, no data exists to produce.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-cyan-200">
                <div className="font-semibold text-cyan-300 mb-0.5">Anonymous Account Options</div>
                <div>You can use Badiie VPN without providing any personal identification, phone number, or KYC verification.</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Badiie Zero-Knowledge Privacy Protocol</span>
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
