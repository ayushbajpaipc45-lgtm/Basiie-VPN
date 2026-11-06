import { VpnServer } from '../types/vpn';

// Deterministic key generation mock for demo clients
function generateKey(seed: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 43; i++) {
    const idx = Math.abs((hash * (i + 13) + i * 37) % chars.length);
    result += chars[idx];
  }
  return result + '=';
}

export function generateWireGuardConfig(server: VpnServer): string {
  const clientPrivateKey = generateKey(`client-private-${server.id}`);
  const serverPublicKey = generateKey(`server-public-${server.id}`);
  const clientIp = `10.66.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 250 + 2)}`;

  return `[Interface]
# Badiie VPN Zero-Knowledge Profile
# Node: ${server.name} (${server.city}, ${server.country})
# Strictly No-Logs Verified
PrivateKey = ${clientPrivateKey}
Address = ${clientIp}/32, fd42:42:42::2/128
DNS = 10.66.0.1, 1.1.1.1

[Peer]
# Server: ${server.ip}
PublicKey = ${serverPublicKey}
Endpoint = ${server.ip}:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`;
}

export function generateOpenVpnConfig(server: VpnServer): string {
  return `# Badiie VPN OpenVPN Configuration
# Server: ${server.name}
client
dev tun
proto udp
remote ${server.ip} 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA512
verb 3
fast-io
mute-replay-warnings
# Zero-Logs Policy Enforced
dhcp-option DNS 10.66.0.1
dhcp-option DNS 1.1.1.1
block-outside-dns
<ca>
-----BEGIN CERTIFICATE-----
MIIDRjCCAi6gAwIBAgIUW...AEGIS_ZERO_KNOWLEDGE_ROOT_CA...==
-----END CERTIFICATE-----
</ca>
`;
}

export function downloadConfigFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
