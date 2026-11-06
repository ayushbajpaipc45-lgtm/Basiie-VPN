export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';

export type Continent = 
  | 'Europe' 
  | 'North America' 
  | 'Asia-Pacific' 
  | 'Latin America' 
  | 'Middle East & Africa'
  | 'Oceania';

export type ServerFeature = 
  | 'streaming' 
  | 'p2p' 
  | 'double_vpn' 
  | 'tor' 
  | 'obfuscated' 
  | 'ram_only';

export type VpnProtocol = 'WireGuard' | 'OpenVPN UDP' | 'OpenVPN TCP' | 'IKEv2' | 'Shadowsocks';

export interface VpnServer {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string; // ISO 2-letter
  flag: string;
  continent: Continent;
  ip: string;
  ping: number; // in ms
  load: number; // percentage 0-100
  features: ServerFeature[];
  coordinates: {
    lat: number;
    lng: number;
    x: number; // Map SVG projected coordinate %
    y: number; // Map SVG projected coordinate %
  };
  entryNode?: {
    country: string;
    city: string;
    ip: string;
  };
}

export interface ConnectionMetrics {
  durationSeconds: number;
  downloadSpeedMbps: number;
  uploadSpeedMbps: number;
  bytesReceived: number;
  bytesSent: number;
  packetsLost: number;
  encryptionCipher: string;
  activeIp: string;
}

export interface SplitTunnelRule {
  id: string;
  name: string;
  type: 'app' | 'domain';
  value: string;
  action: 'bypass' | 'tunnel';
}

export interface SecuritySettings {
  protocol: VpnProtocol;
  killSwitch: boolean;
  threatProtection: boolean; // Ad, tracker, malware blocker
  dnsLeakProtection: boolean;
  ipv6Protection: boolean;
  autoConnectOnWifi: boolean;
  lanBypass: boolean;
  customDns: 'aegis' | 'cloudflare' | 'quad9' | 'custom';
  customDnsAddress: string;
  splitTunnelingEnabled: boolean;
  splitTunnelRules: SplitTunnelRule[];
}

export interface LeakTestResult {
  step: 'idle' | 'checking_ip' | 'checking_dns' | 'checking_webrtc' | 'checking_ipv6' | 'completed';
  ipStatus: 'safe' | 'leaked' | 'pending';
  dnsStatus: 'safe' | 'leaked' | 'pending';
  webrtcStatus: 'safe' | 'leaked' | 'pending';
  ipv6Status: 'safe' | 'leaked' | 'pending';
  detectedIp: string;
  detectedDns: string;
  detectedIsp: string;
  detectedCity: string;
  detectedCountry: string;
  webrtcLocalIp: string;
  summary: string;
}
