import React, { useState } from 'react';
import {
  TrendingUp, Users, MessageSquare, DollarSign, ArrowUpRight,
  Download, FileText, BarChart3, Clock, Eye, Zap, Target
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const mockData = {
  overview: {
    contactsAdded: 156,
    messagesSent: 2450,
    messagesReceived: 1890,
    campaignsSent: 12,
    postsPublished: 34,
    reviewsReceived: 28,
    dealsWon: 45,
    totalRevenue: 1250000,
    conversionRate: 28.8,
    avgResponseTime: '2.5 hours',
  },
  leadScores: {
    very_hot: 12,
    hot: 34,
    warm: 67,
    cold: 45,
    averageScore: 52,
  },
  topLeads: [
    { name: 'Rahul Sharma', score: 92, category: 'very_hot', dealValue: 250000, reason: 'High engagement + VIP tag' },
    { name: 'Priya Patel', score: 87, category: 'very_hot', dealValue: 180000, reason: 'Recent activity + large deal' },
    { name: 'Amit Kumar', score: 78, category: 'hot', dealValue: 120000, reason: 'Multiple interactions' },
    { name: 'Sneha Reddy', score: 72, category: 'hot', dealValue: 95000, reason: 'Profile 100% complete' },
    { name: 'Vikram Singh', score: 65, category: 'warm', dealValue: 75000, reason: 'Good engagement' },
  ],
  weeklyData: [
    { day: 'Mon', leads: 18, messages: 320, revenue: 45000 },
    { day: 'Tue', leads: 24, messages: 410, revenue: 62000 },
    { day: 'Wed', leads: 32, messages: 380, revenue: 78000 },
    { day: 'Thu', leads: 28, messages: 450, revenue: 95000 },
    { day: 'Fri', leads: 42, messages: 520, revenue: 125000 },
    { day: 'Sat', leads: 35, messages: 290, revenue: 85000 },
    { day: 'Sun', leads: 20, messages: 180, revenue: 35000 },
  ],
};

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'export'>('overview');

  const formatCurrency = (val: number) => '₹' + (val / 100000).toFixed(1) + 'L';
  const getScoreColor = (score: number) =>
    score >= 75 ? 'text-red-600 bg-red-50' :
    score >= 50 ? 'text-orange-600 bg-orange-50' :
    score >= 25 ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600 bg-gray-50';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            Reports & Intelligence
          </h1>
          <p className="text-gray-600">AI-powered insights, lead scoring, and export tools</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex gap-2 mb-6">
        {[
          { id: 'overview' as const, label: 'Overview', icon: <BarChart3 size={16} /> },
          { id: 'leads' as const, label: 'AI Lead Scores', icon: <Target size={16} /> },
          { id: 'export' as const, label: 'Export Data', icon: <Download size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'New Contacts', value: mockData.overview.contactsAdded, icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600', change: '+12%' },
              { label: 'Messages Sent', value: mockData.overview.messagesSent.toLocaleString(), icon: <MessageSquare size={20} />, color: 'bg-green-50 text-green-600', change: '+15%' },
              { label: 'Revenue', value: formatCurrency(mockData.overview.totalRevenue), icon: <DollarSign size={20} />, color: 'bg-purple-50 text-purple-600', change: '+22%' },
              { label: 'Conversion Rate', value: mockData.overview.conversionRate + '%', icon: <TrendingUp size={20} />, color: 'bg-orange-50 text-orange-600', change: '+5%' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <ArrowUpRight size={14} />{stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />Weekly Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="leads" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} name="Leads" />
                  <Area type="monotone" dataKey="messages" stroke="#10B981" fill="#10B981" fillOpacity={0.1} name="Messages" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Campaigns Sent', value: mockData.overview.campaignsSent, icon: <Zap size={18} /> },
              { label: 'Posts Published', value: mockData.overview.postsPublished, icon: <FileText size={18} /> },
              { label: 'Reviews Received', value: mockData.overview.reviewsReceived, icon: <Eye size={18} /> },
              { label: 'Avg Response Time', value: mockData.overview.avgResponseTime, icon: <Clock size={18} /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-600">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* AI LEAD SCORES */}
      {activeTab === 'leads' && (
        <>
          {/* Score Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Very Hot', count: mockData.leadScores.very_hot, color: 'bg-red-500', textColor: 'text-red-600' },
              { label: 'Hot', count: mockData.leadScores.hot, color: 'bg-orange-500', textColor: 'text-orange-600' },
              { label: 'Warm', count: mockData.leadScores.warm, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
              { label: 'Cold', count: mockData.leadScores.cold, color: 'bg-gray-400', textColor: 'text-gray-600' },
              { label: 'Average', count: mockData.leadScores.averageScore, color: 'bg-blue-500', textColor: 'text-blue-600', isAvg: true },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold`}>
                  {item.count}{item.isAvg && '%'}
                </div>
                <p className={`font-medium ${item.textColor}`}>{item.label}</p>
                {!item.isAvg && <p className="text-sm text-gray-500">leads</p>}
              </div>
            ))}
          </div>

          {/* Top Leads Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Target size={20} className="text-red-600" />
                Top Scoring Leads
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {mockData.topLeads.map((lead, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(lead.dealValue)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                        Score: {lead.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* EXPORT DATA */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Contacts', description: 'Export all contacts with tags, source, and deal values', icon: <Users size={24} />, format: 'CSV' },
            { name: 'Messages', description: 'Export message history with contact details and status', icon: <MessageSquare size={24} />, format: 'CSV' },
            { name: 'Campaigns', description: 'Export campaign performance with delivery stats', icon: <Zap size={24} />, format: 'CSV' },
            { name: 'Orders', description: 'Export order history with payment and shipping details', icon: <FileText size={24} />, format: 'CSV' },
            { name: 'Reviews', description: 'Export all reviews with ratings and responses', icon: <Eye size={24} />, format: 'CSV' },
            { name: 'Full Report', description: 'Complete business report with analytics (PDF)', icon: <BarChart3 size={24} />, format: 'PDF' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{item.format}</span>
                <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
