import React, { useState } from 'react';
import {
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2,
  PhoneIncoming, PhoneOutgoing, Search
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RT, ResponsiveContainer } from 'recharts';

interface CallRecord {
  id: string;
  name: string;
  phone: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  time: string;
  avatar: string;
}

const mockCalls: CallRecord[] = [
  { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', type: 'incoming', duration: '4:32', time: '2 min ago', avatar: 'RS' },
  { id: '2', name: 'Priya Patel', phone: '+91 98765 43211', type: 'outgoing', duration: '2:15', time: '15 min ago', avatar: 'PP' },
  { id: '3', name: 'Amit Kumar', phone: '+91 98765 43212', type: 'missed', duration: '-', time: '1 hour ago', avatar: 'AK' },
  { id: '4', name: 'Sneha Reddy', phone: '+91 98765 43213', type: 'incoming', duration: '8:45', time: '2 hours ago', avatar: 'SR' },
  { id: '5', name: 'Vikram Singh', phone: '+91 98765 43214', type: 'outgoing', duration: '1:30', time: '3 hours ago', avatar: 'VS' },
  { id: '6', name: 'Meera Joshi', phone: '+91 98765 43215', type: 'missed', duration: '-', time: '5 hours ago', avatar: 'MJ' },
  { id: '7', name: 'Rajesh Gupta', phone: '+91 98765 43216', type: 'incoming', duration: '6:20', time: 'Yesterday', avatar: 'RG' },
  { id: '8', name: 'Anita Desai', phone: '+91 98765 43217', type: 'outgoing', duration: '3:10', time: 'Yesterday', avatar: 'AD' },
];

const callStats = [
  { name: 'Mon', incoming: 8, outgoing: 12 }, { name: 'Tue', incoming: 10, outgoing: 9 },
  { name: 'Wed', incoming: 14, outgoing: 11 }, { name: 'Thu', incoming: 9, outgoing: 15 },
  { name: 'Fri', incoming: 12, outgoing: 10 }, { name: 'Sat', incoming: 5, outgoing: 3 },
  { name: 'Sun', incoming: 2, outgoing: 1 },
];

const typeConfig = {
  incoming: { icon: <PhoneIncoming size={14} />, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Incoming' },
  outgoing: { icon: <PhoneOutgoing size={14} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Outgoing' },
  missed: { icon: <PhoneOff size={14} />, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Missed' },
};

const VoiceCallPage: React.FC = () => {
  const [calls] = useState(mockCalls);
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [dialNumber, setDialNumber] = useState('');
  const [showDialer, setShowDialer] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCalls = calls.filter(c => filter === 'all' || c.type === filter).filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const startCall = () => { setIsCallActive(true); setCallTimer(0); const i = setInterval(() => setCallTimer(t => t + 1), 1000); setTimeout(() => { clearInterval(i); setIsCallActive(false); }, 30000); };
  const endCall = () => setIsCallActive(false);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const dialPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="p-6 lg:p-8 animate-fade-in-up">
      {/* Active Call Overlay */}
      {isCallActive && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-blue-900/95 to-purple-900/95 flex flex-col items-center justify-center text-white animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/30 animate-pulse">
            <Phone size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">{dialNumber || 'Unknown'}</h2>
          <p className="text-blue-200 text-lg mb-8">{formatTime(callTimer)}</p>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}>
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button onClick={endCall} className="p-5 bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-lg shadow-red-500/30">
              <PhoneOff size={28} />
            </button>
            <button className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all">
              <Volume2 size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voice Calls</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your business calls</p>
        </div>
        <button onClick={() => setShowDialer(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20">
          <Phone size={18} /> Make a Call
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 stagger-children">
        {[
          { icon: <PhoneCall size={20} />, label: 'Total Calls', value: '186', change: '+15%', color: 'blue' },
          { icon: <PhoneIncoming size={20} />, label: 'Incoming', value: '82', change: '+8%', color: 'green' },
          { icon: <PhoneOutgoing size={20} />, label: 'Outgoing', value: '94', change: '+22%', color: 'purple' },
          { icon: <PhoneOff size={20} />, label: 'Missed', value: '10', change: '-5%', color: 'red' },
        ].map((s, i) => {
          const cm: Record<string, string> = { blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400', purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' };
          return (
            <div key={i} className="modern-card hover-lift rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3"><div className={`p-2.5 rounded-xl ${cm[s.color]}`}>{s.icon}</div><span className={`text-xs font-semibold ${s.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{s.change}</span></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Call Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="modern-card rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Call Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={callStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <RT />
              <Bar dataKey="incoming" fill="#10B981" radius={[4, 4, 0, 0]} name="Incoming" />
              <Bar dataKey="outgoing" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Outgoing" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Call Log */}
        <div className="lg:col-span-2 modern-card rounded-2xl">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {(['all', 'incoming', 'outgoing', 'missed'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calls..." className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-44" />
            </div>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-[400px] overflow-y-auto">
            {filteredCalls.map(call => {
              const tc = typeConfig[call.type];
              return (
                <div key={call.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{call.avatar}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{call.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{call.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tc.bg} ${tc.color}`}>{tc.icon} {tc.label}</span>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-white">{call.duration !== '-' ? call.duration : '—'}</p>
                      <p className="text-xs text-gray-400">{call.time}</p>
                    </div>
                    <button onClick={() => { setDialNumber(call.phone); startCall(); }} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Call back">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dialer Modal */}
      {showDialer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDialer(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">Dial Pad</h2>
            <div className="text-center mb-4">
              <input value={dialNumber} onChange={e => setDialNumber(e.target.value)} placeholder="Enter number" className="w-full text-center text-2xl font-light bg-transparent text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-600 pb-2 focus:border-blue-500 outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {dialPad.map(d => (
                <button key={d} onClick={() => setDialNumber(prev => prev + d)} className="h-14 rounded-xl bg-gray-50 dark:bg-gray-700 text-xl font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors active:scale-95">
                  {d}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => { setShowDialer(false); if (dialNumber) startCall(); }} className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20">
                <Phone size={24} />
              </button>
              <button onClick={() => { setDialNumber(''); }} className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCallPage;
