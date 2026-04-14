import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Users, Calendar, Star,
} from 'lucide-react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { useAuthStore } from '../lib/authStore';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

const mockContacts = [
  { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@email.com', tags: ['Hot Lead', 'Mumbai'], stage: 'Contacted', dealValue: 50000, lastActivity: '2 min ago', avatar: 'RS' },
  { id: '2', name: 'Priya Patel', phone: '+91 98765 43211', email: 'priya@email.com', tags: ['New Lead'], stage: 'New Lead', dealValue: 25000, lastActivity: '1 hour ago', avatar: 'PP' },
  { id: '3', name: 'Amit Kumar', phone: '+91 98765 43212', tags: ['VIP', 'Delhi'], stage: 'Qualified', dealValue: 100000, lastActivity: '3 hours ago', avatar: 'AK' },
  { id: '4', name: 'Sneha Reddy', phone: '+91 98765 43213', email: 'sneha@email.com', tags: ['Won'], stage: 'Won', dealValue: 75000, lastActivity: '1 day ago', avatar: 'SR' },
];

const analyticsData = [
  { name: 'Mon', messages: 120, posts: 8, leads: 15 },
  { name: 'Tue', messages: 150, posts: 10, leads: 22 },
  { name: 'Wed', messages: 180, posts: 12, leads: 28 },
  { name: 'Thu', messages: 200, posts: 15, leads: 35 },
  { name: 'Fri', messages: 250, posts: 18, leads: 42 },
  { name: 'Sat', messages: 220, posts: 14, leads: 38 },
  { name: 'Sun', messages: 180, posts: 10, leads: 25 },
];

const pipelineData = [
  { name: 'New Lead', value: 5, color: '#3B82F6' },
  { name: 'Contacted', value: 3, color: '#10B981' },
  { name: 'Qualified', value: 2, color: '#F59E0B' },
  { name: 'Won', value: 1, color: '#8B5CF6' },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon }) => (
  <div className="modern-card hover-lift rounded-2xl p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl text-blue-600 dark:text-blue-400">{icon}</div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userName = user?.name || 'Admin';

  const stats: StatCardProps[] = [
    { title: 'Leads Today', value: '12', change: '+8%', positive: true, icon: <Users size={24} /> },
    { title: 'Messages Sent', value: '456', change: '+15%', positive: true, icon: <MessageSquare size={24} /> },
    { title: 'Scheduled Posts', value: '8', change: '+2', positive: true, icon: <Calendar size={24} /> },
    { title: 'Avg. Rating', value: '4.5⭐', change: '+0.3', positive: true, icon: <Star size={24} /> },
  ];

  return (
    <div className="p-6 lg:p-8 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="modern-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={2} name="Messages" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="posts" stroke="#10B981" strokeWidth={2} name="Posts" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="leads" stroke="#F59E0B" strokeWidth={2} name="Leads" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="modern-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pipelineData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="modern-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leads</h3>
            <button onClick={() => navigate('/crm')} className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {mockContacts.slice(0, 4).map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {contact.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">₹{contact.dealValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{contact.lastActivity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modern-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/whatsapp')} className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all gap-2 border border-green-200/50 dark:border-green-800/30 hover-lift">
              <MessageSquare className="text-green-600 dark:text-green-400" size={24} />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">WhatsApp Chat</span>
            </button>
            <button onClick={() => navigate('/social')} className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all gap-2 border border-blue-200/50 dark:border-blue-800/30 hover-lift">
              <span className="text-2xl">📱</span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Create Post</span>
            </button>
            <button onClick={() => navigate('/creative')} className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all gap-2 border border-purple-200/50 dark:border-purple-800/30 hover-lift">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Make Poster</span>
            </button>
            <button onClick={() => navigate('/reviews')} className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 transition-all gap-2 border border-orange-200/50 dark:border-orange-800/30 hover-lift">
              <Star className="text-orange-600" size={24} />
              <span className="text-sm font-medium text-orange-700">View Reviews</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
