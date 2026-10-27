import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Activity, 
  Server, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  ArrowLeft,
  Terminal,
  Signal,
  Wifi
} from 'lucide-react';
import { Language } from '../types';

interface NetworkNode {
  id: string;
  name: string;
  nameTa: string;
  role: string;
  roleTa: string;
  ip: string;
  latency: number;
  status: 'online' | 'degraded' | 'syncing';
  load: number;
}

interface NetworkSystemProps {
  onBack: () => void;
  language: Language;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onPulseLight?: () => void;
}

export const NetworkSystem: React.FC<NetworkSystemProps> = ({
  onBack,
  language,
  onToast,
  onPulseLight,
}) => {
  const isTa = language === 'ta';

  const [pinging, setPinging] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('auth-node');
  const [packetCount, setPacketCount] = useState<number>(1420);
  const [avgPing, setAvgPing] = useState<number>(18);
  const [throughput, setThroughput] = useState<number>(48.6);

  const [nodes, setNodes] = useState<NetworkNode[]>([
    {
      id: 'gateway',
      name: 'Primary Ingress Gateway',
      nameTa: 'முதன்மைக் கேட்வே',
      role: 'Global Routing & TLS Termination',
      roleTa: 'உலகளாவிய ரூட்டிங் & டிஎல்எஸ்',
      ip: '198.51.100.14',
      latency: 16,
      status: 'online',
      load: 34,
    },
    {
      id: 'auth-node',
      name: 'Auth Core (updatenew-48b45)',
      nameTa: 'அங்கீகார மையம் (updatenew-48b45)',
      role: 'Firebase Authentication & Token Signing',
      roleTa: 'Firebase அங்கீகாரம் & டோக்கன் சரிபார்ப்பு',
      ip: '10.240.0.8',
      latency: 19,
      status: 'online',
      load: 42,
    },
    {
      id: 'db-cluster',
      name: 'Firestore Document Cluster',
      nameTa: 'ஃபயர்ஸ்டோர் தரவுத்தளம்',
      role: 'Encrypted Persistence & Security Rules',
      roleTa: 'மறைகுறியாக்கப்பட்ட தரவுத்தள பாதுகாப்பு',
      ip: '10.240.1.22',
      latency: 22,
      status: 'online',
      load: 28,
    },
    {
      id: 'edge-cdn',
      name: 'ATM Edge CDN Hub',
      nameTa: 'ATM எட்ஜ் சிடிஎன் மையம்',
      role: 'Low-latency Asset Distribution',
      roleTa: 'குறைந்த தாமத உள்ளடக்க விநியோகம்',
      ip: '172.16.4.99',
      latency: 14,
      status: 'online',
      load: 18,
    },
  ]);

  // Dynamic live metric simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketCount((p) => p + Math.floor(Math.random() * 5 + 1));
      setThroughput((prev) => +(prev + (Math.random() - 0.5) * 1.8).toFixed(1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleRunPing = () => {
    setPinging(true);
    onToast(isTa ? 'நெட்வொர்க் பிங் சோதனை தொடங்குகிறது...' : 'Running real-time network latency test...', 'info');
    onPulseLight?.();

    setTimeout(() => {
      const newPing = Math.floor(Math.random() * 6 + 15);
      setAvgPing(newPing);
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          latency: Math.floor(Math.random() * 8 + 14),
          load: Math.floor(Math.random() * 20 + 25),
        }))
      );
      setPinging(false);
      onToast(
        isTa
          ? `அனைத்து நெட்வொர்க் முனையங்களும் சீராக உள்ளன! சராசரி பிங்: ${newPing}ms`
          : `All network nodes operational! Average ping: ${newPing}ms`,
        'success'
      );
    }, 1200);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full max-w-[760px] bg-white rounded-lg shadow-2xl overflow-hidden border border-emerald-900/10 text-left animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#446d63] via-[#319885] to-[#277e6e] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center border border-white/20 backdrop-blur-sm">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">ATM.IHSAN&amp;NETWORKS</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 uppercase tracking-wide">
                Live System
              </span>
            </div>
            <p className="text-xs text-emerald-100 opacity-90 mt-0.5">
              {isTa ? 'நெட்வொர்க் மேலாண்மை மற்றும் கட்டமைப்பு மையம்' : 'Infrastructure Topology & Operations Console'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunPing}
            disabled={pinging}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-[#277e6e] hover:bg-emerald-50 text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95 disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
            <span>{pinging ? (isTa ? 'சோதிக்கிறது...' : 'Testing...') : (isTa ? 'பிங் சோதனை' : 'Test Ping')}</span>
          </button>

          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-black/25 hover:bg-black/35 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isTa ? 'திரும்பு' : 'Back'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-7 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded bg-[#f8faf9] border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isTa ? 'சராசரி பிங் (Ping)' : 'Latency (RTT)'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-gray-900 font-mono">{avgPing}</span>
              <span className="text-xs font-medium text-emerald-700">ms</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Optimal
            </span>
          </div>

          <div className="p-3.5 rounded bg-[#f8faf9] border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isTa ? 'வேகம் (Throughput)' : 'Throughput'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-gray-900 font-mono">{throughput}</span>
              <span className="text-xs font-medium text-gray-500">MB/s</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium">99.99% Uptime</span>
          </div>

          <div className="p-3.5 rounded bg-[#f8faf9] border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isTa ? 'பாக்கெட் பரிமாற்றம்' : 'Packets Routed'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-gray-900 font-mono">
                {packetCount.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">0.00% Loss</span>
          </div>

          <div className="p-3.5 rounded bg-[#f8faf9] border border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              {isTa ? 'முனையங்கள்' : 'Active Nodes'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-gray-900 font-mono">{nodes.length} / 4</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Fully Synced</span>
          </div>
        </div>

        {/* Visual Topology Architecture */}
        <div className="bg-[#f0f7f5] rounded-lg p-5 border border-emerald-900/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#319885]" />
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                {isTa ? 'நெட்வொர்க் கட்டமைப்பு வரைபடம்' : 'Network Mesh Topology'}
              </h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {isTa ? 'முனையத்தைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்' : 'Click a node to inspect'}
            </span>
          </div>

          {/* Interactive Topology Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  type="button"
                  className={`p-3.5 rounded text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white border-[#319885] shadow-md ring-2 ring-[#319885]/20'
                      : 'bg-white/80 hover:bg-white border-gray-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-mono font-semibold text-gray-500">
                      {node.latency} ms
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                    {isTa ? node.nameTa : node.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {isTa ? node.roleTa : node.role}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-600">
                    <span>IP: {node.ip}</span>
                    <span className="text-emerald-700 font-semibold">{node.load}% load</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Detailed Inspector */}
        <div className="p-4 rounded bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#319885]" />
              <span className="text-xs font-bold text-gray-900">
                {isTa ? selectedNode.nameTa : selectedNode.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#277e6e]">
                STATUS: ONLINE
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {isTa ? selectedNode.roleTa : selectedNode.role}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => {
                onToast(
                  isTa
                    ? `${selectedNode.name} முனையம் புதுப்பிக்கப்பட்டது!`
                    : `Telemetry refreshed for ${selectedNode.name}`,
                  'success'
                );
                onPulseLight?.();
              }}
              type="button"
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isTa ? 'மின் துடிப்பு அனுப்பு' : 'Pulse Signal'}</span>
            </button>

            <button
              onClick={onBack}
              type="button"
              className="px-4 py-2 bg-[#319885] hover:bg-[#277e6e] text-white rounded text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <span>{isTa ? 'போர்ட்டலுக்குத் திரும்பு' : 'Auth Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
