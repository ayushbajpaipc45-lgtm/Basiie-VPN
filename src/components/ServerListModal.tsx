import React, { useState, useMemo } from 'react';
import { useVpn } from '../context/VpnContext';
import { VpnServer, Continent, ServerFeature } from '../types/vpn';
import { SERVERS_DATABASE, CONTINENTS } from '../data/servers';
import { 
  Search, 
  Star, 
  X, 
  Check, 
  Activity, 
  Wifi, 
  Tv, 
  DownloadCloud, 
  Layers, 
  ShieldAlert, 
  EyeOff,
  Flame,
  ArrowUpDown
} from 'lucide-react';

interface ServerListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerListModal: React.FC<ServerListModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedServer, 
    setSelectedServer, 
    connect, 
    status, 
    favorites, 
    toggleFavorite 
  } = useVpn();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'favorites' | ServerFeature>('all');
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'ping' | 'load' | 'name'>('recommended');

  const filteredServers = useMemo(() => {
    let result = [...SERVERS_DATABASE];

    // Filter by category
    if (activeCategory === 'favorites') {
      result = result.filter(s => favorites.includes(s.id));
    } else if (activeCategory !== 'all') {
      result = result.filter(s => s.features.includes(activeCategory as ServerFeature));
    }

    // Filter by continent
    if (selectedContinent !== 'all') {
      result = result.filter(s => s.continent === selectedContinent);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.country.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.ip.includes(q) ||
        s.continent.toLowerCase().includes(q) ||
        s.countryCode.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'recommended') {
        const scoreA = a.ping * 1.4 + a.load;
        const scoreB = b.ping * 1.4 + b.load;
        return scoreA - scoreB;
      }
      if (sortBy === 'ping') return a.ping - b.ping;
      if (sortBy === 'load') return a.load - b.load;
      if (sortBy === 'name') return a.country.localeCompare(b.country);
      return 0;
    });

    return result;
  }, [searchQuery, activeCategory, selectedContinent, sortBy, favorites]);

  if (!isOpen) return null;

  const handleSelectServer = (server: VpnServer) => {
    setSelectedServer(server);
    connect(server);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span>Global Server Network</span>
              <span className="text-xs text-slate-400 font-normal font-mono tabular-nums">
                ({filteredServers.length} / {SERVERS_DATABASE.length} nodes)
              </span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              100% RAM-only diskless hardware · Zero logs recorded
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

        {/* Search & Sort Controls */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search country, city, continent, or IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 shrink-0">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="recommended">Recommended (Fastest)</option>
                <option value="ping">Lowest Latency</option>
                <option value="load">Lowest Load</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              All Locations ({SERVERS_DATABASE.length})
            </button>
            <button
              onClick={() => setActiveCategory('favorites')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeCategory === 'favorites'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400/40" />
              <span>Favorites ({favorites.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('streaming')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeCategory === 'streaming'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Streaming</span>
            </button>
            <button
              onClick={() => setActiveCategory('p2p')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeCategory === 'p2p'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>P2P / Torrenting</span>
            </button>
            <button
              onClick={() => setActiveCategory('double_vpn')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeCategory === 'double_vpn'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Double Hop (Multi-VPN)</span>
            </button>
            <button
              onClick={() => setActiveCategory('obfuscated')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeCategory === 'obfuscated'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Obfuscated / Anti-DPI</span>
            </button>
          </div>

          {/* Continents filter row */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] text-slate-400">
            <span className="shrink-0 text-slate-500 mr-1">Region:</span>
            <button
              onClick={() => setSelectedContinent('all')}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                selectedContinent === 'all' ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              All
            </button>
            {CONTINENTS.map(cont => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  selectedContinent === cont ? 'text-cyan-400 font-semibold' : 'hover:text-slate-200'
                }`}
              >
                {cont}
              </button>
            ))}
          </div>
        </div>

        {/* Server List Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredServers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <div className="text-sm font-medium text-slate-300">No servers matched your criteria</div>
              <div className="text-xs text-slate-500 mt-1">Try modifying your search or filters</div>
            </div>
          ) : (
            filteredServers.map(server => {
              const isSelected = server.id === selectedServer.id;
              const isConnected = isSelected && status === 'connected';
              const isFav = favorites.includes(server.id);

              return (
                <div
                  key={server.id}
                  onClick={() => handleSelectServer(server)}
                  className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-cyan-950/20 hover:bg-cyan-950/30' 
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(server.id);
                      }}
                      className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                      aria-label="Toggle favorite"
                    >
                      <Star 
                        className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} 
                      />
                    </button>

                    <span className="text-2xl shrink-0" role="img" aria-label={server.country}>
                      {server.flag}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100 truncate">
                          {server.country}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                          · {server.city}
                        </span>
                        {server.features.includes('double_vpn') && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                            Multi-Hop
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                        <span>{server.ip}</span>
                        <span>·</span>
                        <span className="text-slate-400">{server.continent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Metrics & Quick Connect Action */}
                  <div className="flex items-center gap-5 shrink-0">
                    {/* Ping Indicator */}
                    <div className="text-right">
                      <div className="text-xs font-mono tabular-nums text-slate-200 flex items-center justify-end gap-1">
                        <Wifi className={`w-3 h-3 ${server.ping < 20 ? 'text-cyan-400' : server.ping < 40 ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <span>{server.ping} ms</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Latency</div>
                    </div>

                    {/* Server Load Bar */}
                    <div className="w-16 hidden sm:block text-right">
                      <div className="text-xs font-mono tabular-nums text-slate-200">
                        {server.load}%
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            server.load < 40 ? 'bg-cyan-500' : server.load < 65 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${server.load}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectServer(server);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isSelected
                            ? 'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isConnected ? 'Active' : isSelected ? 'Connect' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>All nodes protected by 4096-bit Ephemeral DH keys & AES-256-GCM / WireGuard</span>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-100 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
