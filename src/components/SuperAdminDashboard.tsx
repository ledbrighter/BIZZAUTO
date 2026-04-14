import React from 'react';
import {
  Building2, Users, MessageSquare, TrendingUp,
  ArrowUpRight, ArrowDownRight, Eye, Shield, DollarSign
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data (replace with API calls once backend is running)
const mockStats = {
  totalBusinesses: 245,
  totalUsers: 1820,
  totalContacts: 45600,
  totalMessages: 128000,
  totalRevenue: 487500,
  activeSubscriptions: 89,
  planBreakdown: { FREE: 156, STARTER: 45, GROWTH: 28, PRO: 12, AGENCY: 4 },
};

const growthData = [
  { month: 'Jan', businesses: 12, users: 85, revenue: 25000 },
  { month: 'Feb', businesses: 18, users: 120, revenue: 38000 },
  { month: 'Mar', businesses: 25, users: 180, revenue: 52000 },
  { month: 'Apr', businesses: 35, users: 250, revenue: 68000 },
  { month: 'May', businesses: 42, users: 320, revenue: 85000 },
  { month: 'Jun', businesses: 55, users: 410, revenue: 112000 },
  { month: 'Jul', businesses: 58, users: 455, revenue: 107500 },
];

const planData = [
  { name: 'FREE', value: 156, color: '#6B7280' },
  { name: 'STARTER', value: 45, color: '#3B82F6' },
  { name: 'GROWTH', value: 28, color: '#10B981' },
  { name: 'PRO', value: 12, color: '#F59E0B' },
  { name: 'AGENCY', value: 4, color: '#8B5CF6' },
];

const recentBusinesses = [
  { id: '1', name: 'Rahul Salon', type: 'salon', plan: 'STARTER', users: 3, contacts: 250, messages: 1200, createdAt: '2024-07-15' },
  { id: '2', name: 'Mumbai Fitness', type: 'gym', plan: 'GROWTH', users: 5, contacts: 800, messages: 4500, createdAt: '2024-07-12' },
  { id: '3', name: 'Delhi Real Estate', type: 'real_estate', plan: 'PRO', users: 12, contacts: 2100, messages: 8900, createdAt: '2024-07-10' },
  { id: '4', name: 'Priya Restaurant', type: 'restaurant', plan: 'FREE', users: 1, contacts: 50, messages: 200, createdAt: '2024-07-08' },
  { id: '5', name: 'Smart Coaching', type: 'coaching', plan: 'STARTER', users: 2, contacts: 180, messages: 950, createdAt: '2024-07-05' },
];

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
  positive?: boolean;
}> = ({ title, value, icon, color, change, positive }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const SuperAdminDashboard: React.FC = () => {
  const formatCurrency = (val: number) =>
    '₹' + val.toLocaleString('en-IN');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-purple-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Platform-wide overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Businesses"
          value={mockStats.totalBusinesses.toString()}
          icon={<Building2 size={24} />}
          color="bg-blue-50 text-blue-600"
          change="+12%"
          positive
        />
        <StatCard
          title="Total Users"
          value={mockStats.totalUsers.toLocaleString()}
          icon={<Users size={24} />}
          color="bg-green-50 text-green-600"
          change="+8%"
          positive
        />
        <StatCard
          title="Total Messages"
          value={(mockStats.totalMessages / 1000).toFixed(0) + 'K'}
          icon={<MessageSquare size={24} />}
          color="bg-purple-50 text-purple-600"
          change="+15%"
          positive
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(mockStats.totalRevenue)}
          icon={<DollarSign size={24} />}
          color="bg-yellow-50 text-yellow-600"
          change="+22%"
          positive
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Growth Trend (Last 7 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="businesses" stroke="#3B82F6" strokeWidth={2} name="Businesses" />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Monthly Revenue (₹)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Plan Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {planData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {planData.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <span className="text-gray-600">{plan.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{plan.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Active Subscriptions</p>
              <p className="text-2xl font-bold text-green-700">{mockStats.activeSubscriptions}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Contacts</p>
              <p className="text-2xl font-bold text-blue-700">{(mockStats.totalContacts / 1000).toFixed(1)}K</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Avg Revenue/Business</p>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(Math.round(mockStats.totalRevenue / mockStats.activeSubscriptions))}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600 mb-1">Users per Business</p>
              <p className="text-2xl font-bold text-yellow-700">{(mockStats.totalUsers / mockStats.totalBusinesses).toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Businesses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Businesses</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View All <Eye size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBusinesses.map((biz) => (
                <tr key={biz.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {biz.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{biz.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{biz.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      biz.plan === 'FREE' ? 'bg-gray-100 text-gray-700' :
                      biz.plan === 'STARTER' ? 'bg-blue-100 text-blue-700' :
                      biz.plan === 'GROWTH' ? 'bg-green-100 text-green-700' :
                      biz.plan === 'PRO' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {biz.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{biz.users}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{biz.contacts}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{biz.messages.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{biz.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
