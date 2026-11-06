import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  ConnectionStatus, 
  VpnServer, 
  ConnectionMetrics, 
  SecuritySettings, 
  LeakTestResult,
  SplitTunnelRule,
  VpnProtocol
} from '../types/vpn';
import { SERVERS_DATABASE } from '../data/servers';

interface VpnContextType {
  status: ConnectionStatus;
  selectedServer: VpnServer;
  setSelectedServer: (server: VpnServer) => void;
  metrics: ConnectionMetrics;
  handshakeStep: string;
  connect: (server?: VpnServer) => void;
  disconnect: () => void;
  toggleConnect: () => void;
  quickConnect: () => void;
  favorites: string[];
  toggleFavorite: (serverId: string) => void;
  securitySettings: SecuritySettings;
  updateSecuritySettings: (newSettings: Partial<SecuritySettings>) => void;
  addSplitTunnelRule: (rule: Omit<SplitTunnelRule, 'id'>) => void;
  removeSplitTunnelRule: (id: string) => void;
  leakTest: LeakTestResult;
  runLeakTest: () => void;
  realUserIp: {
    ip: string;
    city: string;
    country: string;
    isp: string;
  };
  deviceView: 'pc' | 'mobile';
  setDeviceView: (mode: 'pc' | 'mobile') => void;
  history: { serverId: string; timestamp: number }[];
}

const defaultSecuritySettings: SecuritySettings = {
  protocol: 'WireGuard',
  killSwitch: true,
  threatProtection: true,
  dnsLeakProtection: true,
  ipv6Protection: true,
  autoConnectOnWifi: true,
  lanBypass: true,
  customDns: 'aegis',
  customDnsAddress: '10.66.0.1',
  splitTunnelingEnabled: false,
  splitTunnelRules: [
    { id: '1', name: 'Online Banking & Finance', type: 'domain', value: 'chase.com, bankofamerica.com', action: 'bypass' },
    { id: '2', name: 'BitTorrent / P2P Client', type: 'app', value: 'qbittorrent.exe', action: 'tunnel' },
    { id: '3', name: 'Local Network Printers & NAS', type: 'domain', value: '192.168.1.0/24', action: 'bypass' }
  ]
};

const VpnContext = createContext<VpnContextType | undefined>(undefined);

export const VpnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default server: Switzerland Zurich (flagship ultra-privacy node)
  const defaultServer = SERVERS_DATABASE.find(s => s.id === 'ch-zrh-01') || SERVERS_DATABASE[0];
  const [selectedServer, setSelectedServer] = useState<VpnServer>(defaultServer);
  
  // Set default state to 'connected': Fully unexposed & encrypted out-of-the-box
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [handshakeStep, setHandshakeStep] = useState<string>('');
  
  const [deviceView, setDeviceView] = useState<'pc' | 'mobile'>('pc');

  const [realUserIp] = useState({
    ip: '172.56.42.189',
    city: 'San Francisco',
    country: 'United States',
    isp: 'Comcast Broadband'
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('badiie_vpn_favorites') || localStorage.getItem('aegis_vpn_favorites');
      return saved ? JSON.parse(saved) : ['ch-zrh-01', 'is-rey-01', 'us-nyc-01', 'jp-tyo-01'];
    } catch {
      return ['ch-zrh-01', 'is-rey-01', 'us-nyc-01'];
    }
  });

  const [history, setHistory] = useState<{ serverId: string; timestamp: number }[]>([
    { serverId: defaultServer.id, timestamp: Date.now() - 3600000 }
  ]);

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem('badiie_vpn_settings') || localStorage.getItem('aegis_vpn_settings');
      return saved ? JSON.parse(saved) : defaultSecuritySettings;
    } catch {
      return defaultSecuritySettings;
    }
  });

  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    durationSeconds: 142,
    downloadSpeedMbps: 184.6,
    uploadSpeedMbps: 68.4,
    bytesReceived: 58249012,
    bytesSent: 19842100,
    packetsLost: 0,
    encryptionCipher: 'ChaCha20-Poly1305 (256-bit AEAD)',
    activeIp: defaultServer.ip
  });

  const [leakTest, setLeakTest] = useState<LeakTestResult>({
    step: 'completed',
    ipStatus: 'safe',
    dnsStatus: 'safe',
    webrtcStatus: 'safe',
    ipv6Status: 'safe',
    detectedIp: defaultServer.ip,
    detectedDns: '10.66.0.1 (Zero-Knowledge Recursive)',
    detectedIsp: 'Badiie RAM-Only Anonymous Datacenter',
    detectedCity: defaultServer.city,
    detectedCountry: defaultServer.country,
    webrtcLocalIp: 'Blocked (STUN/ICE candidates disabled)',
    summary: 'Fully unexposed and encrypted. 100% leak-proof across IP, DNS, WebRTC, and IPv6 vectors.'
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync favorites & settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('badiie_vpn_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore in private storage
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('badiie_vpn_settings', JSON.stringify(securitySettings));
    } catch {
      // Ignore
    }
  }, [securitySettings]);

  // Handle active connection metrics simulation
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        setMetrics(prev => {
          // Dynamic realistic fluctuations based on server load and ping
          const baseDown = Math.max(40, 220 - selectedServer.load * 1.4);
          const jitterDown = (Math.random() - 0.5) * 24;
          const currentDown = Math.max(15, Math.round((baseDown + jitterDown) * 10) / 10);

          const baseUp = Math.max(20, 95 - selectedServer.load * 0.6);
          const jitterUp = (Math.random() - 0.5) * 12;
          const currentUp = Math.max(8, Math.round((baseUp + jitterUp) * 10) / 10);

          const addedBytesDown = Math.round((currentDown * 1024 * 1024) / 8);
          const addedBytesUp = Math.round((currentUp * 1024 * 1024) / 8);

          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
            downloadSpeedMbps: currentDown,
            uploadSpeedMbps: currentUp,
            bytesReceived: prev.bytesReceived + addedBytesDown,
            bytesSent: prev.bytesSent + addedBytesUp,
            packetsLost: Math.random() < 0.1 ? 1 : 0,
            activeIp: selectedServer.ip,
            encryptionCipher: getCipherForProtocol(securitySettings.protocol)
          };
        });
      }, 1000);

      timerRef.current = interval;
      return () => clearInterval(interval);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setMetrics(prev => ({
        ...prev,
        durationSeconds: 0,
        downloadSpeedMbps: 0,
        uploadSpeedMbps: 0,
        activeIp: realUserIp.ip
      }));
    }
  }, [status, selectedServer, securitySettings.protocol, realUserIp.ip]);

  function getCipherForProtocol(proto: VpnProtocol): string {
    switch (proto) {
      case 'WireGuard': return 'ChaCha20-Poly1305 (256-bit AEAD)';
      case 'OpenVPN UDP': return 'AES-256-GCM (DHE-4096)';
      case 'OpenVPN TCP': return 'AES-256-GCM (SSL/TLS 1.3)';
      case 'IKEv2': return 'AES-256-CBC (SHA-384 / DH-20)';
      case 'Shadowsocks': return 'AEAD_CHACHA20_POLY1305 (Stealth)';
      default: return 'AES-256-GCM';
    }
  }

  const connect = (server?: VpnServer) => {
    const targetServer = server || selectedServer;
    setSelectedServer(targetServer);
    setStatus('connecting');
    setHandshakeStep('Negotiating zero-knowledge key exchange...');

    // Multi-phase realistic connection animation
    setTimeout(() => {
      setHandshakeStep('Generating ephemeral Curve25519 session keys...');
    }, 400);

    setTimeout(() => {
      setHandshakeStep(`Routing diskless RAM tunnel via ${targetServer.city}...`);
    }, 850);

    setTimeout(() => {
      setHandshakeStep('Validating DNS leak seal & Kill Switch...');
    }, 1200);

    setTimeout(() => {
      setStatus('connected');
      setHandshakeStep('');
      setHistory(prev => [{ serverId: targetServer.id, timestamp: Date.now() }, ...prev.slice(0, 9)]);
    }, 1500);
  };

  const disconnect = () => {
    setStatus('disconnecting');
    setHandshakeStep('Tearing down encrypted tunnel & clearing memory cache...');
    setTimeout(() => {
      setStatus('disconnected');
      setHandshakeStep('');
    }, 600);
  };

  const toggleConnect = () => {
    if (status === 'connected') {
      disconnect();
    } else if (status === 'disconnected') {
      connect();
    }
  };

  const quickConnect = () => {
    // Select server with optimal score = lowest ping + lowest load
    const sorted = [...SERVERS_DATABASE].sort((a, b) => {
      const scoreA = a.ping * 1.5 + a.load;
      const scoreB = b.ping * 1.5 + b.load;
      return scoreA - scoreB;
    });
    const optimal = sorted[0];
    connect(optimal);
  };

  const toggleFavorite = (serverId: string) => {
    setFavorites(prev => 
      prev.includes(serverId) ? prev.filter(id => id !== serverId) : [...prev, serverId]
    );
  };

  const updateSecuritySettings = (newSettings: Partial<SecuritySettings>) => {
    setSecuritySettings(prev => ({ ...prev, ...newSettings }));
  };

  const addSplitTunnelRule = (rule: Omit<SplitTunnelRule, 'id'>) => {
    const newRule: SplitTunnelRule = {
      ...rule,
      id: Math.random().toString(36).substring(2, 9)
    };
    setSecuritySettings(prev => ({
      ...prev,
      splitTunnelRules: [...prev.splitTunnelRules, newRule]
    }));
  };

  const removeSplitTunnelRule = (id: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      splitTunnelRules: prev.splitTunnelRules.filter(r => r.id !== id)
    }));
  };

  const runLeakTest = () => {
    setLeakTest({
      step: 'checking_ip',
      ipStatus: 'pending',
      dnsStatus: 'pending',
      webrtcStatus: 'pending',
      ipv6Status: 'pending',
      detectedIp: 'Querying...',
      detectedDns: 'Querying...',
      detectedIsp: 'Querying...',
      detectedCity: 'Querying...',
      detectedCountry: 'Querying...',
      webrtcLocalIp: 'Scanning interfaces...',
      summary: 'Running real-time leak audit...'
    });

    const isConnected = status === 'connected';

    setTimeout(() => {
      setLeakTest(prev => ({
        ...prev,
        step: 'checking_dns',
        ipStatus: isConnected ? 'safe' : 'leaked',
        detectedIp: isConnected ? selectedServer.ip : realUserIp.ip,
        detectedCity: isConnected ? selectedServer.city : realUserIp.city,
        detectedCountry: isConnected ? selectedServer.country : realUserIp.country,
        detectedIsp: isConnected ? 'Badiie RAM-Only Anonymous Datacenter' : realUserIp.isp,
      }));
    }, 700);

    setTimeout(() => {
      setLeakTest(prev => ({
        ...prev,
        step: 'checking_webrtc',
        dnsStatus: isConnected ? 'safe' : 'leaked',
        detectedDns: isConnected ? '10.66.0.1 (Zero-Knowledge Recursive Resolver)' : '75.75.75.75 (ISP DNS Resolver)',
      }));
    }, 1400);

    setTimeout(() => {
      setLeakTest(prev => ({
        ...prev,
        step: 'checking_ipv6',
        webrtcStatus: isConnected ? 'safe' : 'leaked',
        webrtcLocalIp: isConnected ? 'Blocked (STUN/ICE candidates disabled)' : '192.168.1.144 (Exposed via WebRTC)',
      }));
    }, 2100);

    setTimeout(() => {
      setLeakTest(prev => ({
        ...prev,
        step: 'completed',
        ipv6Status: isConnected ? 'safe' : 'leaked',
        summary: isConnected 
          ? 'Passed! 100% leak-proof. All traffic is fully encrypted and zero identity signals were exposed.'
          : 'Warning: Real IP, ISP DNS, and WebRTC address are exposed. Connect to Badiie VPN to secure your traffic.'
      }));
    }, 2800);
  };

  return (
    <VpnContext.Provider
      value={{
        status,
        selectedServer,
        setSelectedServer,
        metrics,
        handshakeStep,
        connect,
        disconnect,
        toggleConnect,
        quickConnect,
        favorites,
        toggleFavorite,
        securitySettings,
        updateSecuritySettings,
        addSplitTunnelRule,
        removeSplitTunnelRule,
        leakTest,
        runLeakTest,
        realUserIp,
        deviceView,
        setDeviceView,
        history
      }}
    >
      {children}
    </VpnContext.Provider>
  );
};

export const useVpn = () => {
  const context = useContext(VpnContext);
  if (!context) {
    throw new Error('useVpn must be used within a VpnProvider');
  }
  return context;
};
