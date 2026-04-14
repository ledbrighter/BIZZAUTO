import React, { useState } from 'react';
import {
  Zap, Plus, Play, Pause, Trash2, Edit3, Clock,
  MessageSquare, Settings, Bot,
  CheckCircle, XCircle, ArrowRight
} from 'lucide-react';

// Mock data
const mockAutomations = [
  { id: '1', name: 'WhatsApp Auto-Reply', type: 'whatsapp', trigger: 'New message received', status: true, runs: 1250, lastRun: '2 min ago', icon: '💬' },
  { id: '2', name: 'Lead Auto-Responder', type: 'lead', trigger: 'New lead from IndiaMART', status: true, runs: 340, lastRun: '1 hour ago', icon: '👤' },
  { id: '3', name: 'Review Reply Bot', type: 'review', trigger: 'New Google review', status: true, runs: 89, lastRun: '3 hours ago', icon: '⭐' },
  { id: '4', name: 'Follow-up Sequence', type: 'crm', trigger: 'Contact moved to "Contacted"', status: false, runs: 56, lastRun: '2 days ago', icon: '📋' },
  { id: '5', name: 'Email Welcome Series', type: 'email', trigger: 'New contact added', status: true, runs: 210, lastRun: '5 hours ago', icon: '📧' },
  { id: '6', name: 'Birthday Greetings', type: 'whatsapp', trigger: 'Contact birthday today', status: false, runs: 45, lastRun: '1 week ago', icon: '🎂' },
];

const templates = [
  { id: 't1', name: 'WhatsApp Auto-Reply', description: 'Instantly reply to WhatsApp messages with AI-generated responses', icon: '💬', category: 'Messaging' },
  { id: 't2', name: 'Lead Auto-Capture', description: 'Capture leads from IndiaMART, JustDial, Facebook & auto-reply', icon: '👤', category: 'Leads' },
  { id: 't3', name: 'Review Responder', description: 'AI-powered auto-replies to Google reviews', icon: '⭐', category: 'Reviews' },
  { id: 't4', name: 'Drip Campaign', description: 'Multi-step follow-up sequence via WhatsApp & Email', icon: '📧', category: 'Marketing' },
  { id: 't5', name: 'Appointment Reminder', description: 'Send WhatsApp reminders before appointments', icon: '📅', category: 'Scheduling' },
  { id: 't6', name: 'Order Status Update', description: 'Auto-notify customers about order status changes', icon: '📦', category: 'E-Commerce' },
  { id: 't7', name: 'Payment Reminder', description: 'Send payment reminders via WhatsApp', icon: '💳', category: 'Billing' },
  { id: 't8', name: 'Feedback Collection', description: 'Auto-send feedback forms after service', icon: '📝', category: 'Feedback' },
];

const AutomationPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'automations' | 'templates' | 'settings'>('automations');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [automations, setAutomations] = useState(mockAutomations);
  const [settings, setSettings] = useState({
    autoReplyEnabled: true,
    autoReplyMessage: 'Thank you for contacting us! We\'ll get back to you shortly. 😊',
    businessHours: { enabled: true, start: '09:00', end: '18:00' },
    aiReplyEnabled: true,
    aiProvider: 'openrouter',
    maxReplyLength: 200,
  });
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(a =>
      a.id === id ? { ...a, status: !a.status } : a
    ));
    const auto = automations.find(a => a.id === id);
    showToast(`${auto?.name} ${auto?.status ? 'paused' : 'activated'}`);
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
    showToast('Automation deleted');
  };

  const useTemplate = (template: typeof templates[0]) => {
    const newAuto = {
      id: Date.now().toString(),
      name: template.name,
      type: template.category.toLowerCase(),
      trigger: 'Configure trigger',
      status: false,
      runs: 0,
      lastRun: 'Never',
      icon: template.icon,
    };
    setAutomations([...automations, newAuto]);
    setShowTemplateModal(false);
    showToast(`${template.name} added! Configure the trigger to activate.`);
  };

  const saveSettings = () => {
    showToast('Automation settings saved!');
  };

  const getStatusColor = (status: boolean) =>
    status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Zap className="text-yellow-500" size={32} />
            Automation & n8n
          </h1>
          <p className="text-gray-600">Automate replies, workflows, and business processes</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Automation
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Active Automations</p>
          <p className="text-2xl font-bold text-green-600">{automations.filter(a => a.status).length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Runs (All)</p>
          <p className="text-2xl font-bold text-blue-600">{automations.reduce((sum, a) => sum + a.runs, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">n8n Status</p>
          <p className="text-sm font-medium text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Connected
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Auto-Reply</p>
          <p className={`text-sm font-medium ${settings.autoReplyEnabled ? 'text-green-600' : 'text-gray-500'}`}>
            {settings.autoReplyEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex gap-2 mb-6">
        {[
          { id: 'automations' as const, label: 'My Automations', icon: <Zap size={16} /> },
          { id: 'templates' as const, label: 'Templates', icon: <Plus size={16} /> },
          { id: 'settings' as const, label: 'Settings', icon: <Settings size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Automations List */}
      {activeView === 'automations' && (
        <div className="space-y-4">
          {automations.map(auto => (
            <div key={auto.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
                    {auto.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{auto.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {auto.trigger}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{auto.runs.toLocaleString()} runs</p>
                    <p className="text-xs text-gray-500">Last: {auto.lastRun}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(auto.status)}`}>
                    {auto.status ? 'Active' : 'Paused'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAutomation(auto.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        auto.status
                          ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={auto.status ? 'Pause' : 'Activate'}
                    >
                      {auto.status ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => deleteAutomation(auto.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {automations.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
              <Bot size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Automations Yet</h3>
              <p className="text-gray-500 mb-6">Start by choosing a template or create your own</p>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Templates
              </button>
            </div>
          )}
        </div>
      )}

      {/* Templates Grid */}
      {activeView === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
              onClick={() => useTemplate(template)}
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{template.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{template.category}</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {activeView === 'settings' && (
        <div className="max-w-3xl space-y-6">
          {/* Auto-Reply */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-green-600" />
              WhatsApp Auto-Reply
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Enable Auto-Reply</p>
                  <p className="text-sm text-gray-500">Automatically reply to incoming WhatsApp messages</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, autoReplyEnabled: !settings.autoReplyEnabled })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoReplyEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoReplyEnabled ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>

              {settings.autoReplyEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Reply Message</label>
                    <textarea
                      value={settings.autoReplyMessage}
                      onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">AI-Powered Replies</p>
                      <p className="text-sm text-gray-500">Use AI to generate contextual replies</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, aiReplyEnabled: !settings.aiReplyEnabled })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.aiReplyEnabled ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.aiReplyEnabled ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  {settings.aiReplyEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">AI Provider</label>
                        <select
                          value={settings.aiProvider}
                          onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="openrouter">OpenRouter (Recommended)</option>
                          <option value="ollama">Ollama (Local)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Reply Length</label>
                        <input
                          type="number"
                          value={settings.maxReplyLength}
                          onChange={(e) => setSettings({ ...settings, maxReplyLength: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Business Hours
            </h3>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <p className="font-medium text-gray-900">Limit Auto-Replies to Business Hours</p>
                <p className="text-sm text-gray-500">Only send automated replies during working hours</p>
              </div>
              <button
                onClick={() => setSettings({
                  ...settings,
                  businessHours: { ...settings.businessHours, enabled: !settings.businessHours.enabled }
                })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.businessHours.enabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.businessHours.enabled ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>

            {settings.businessHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.businessHours.start}
                    onChange={(e) => setSettings({
                      ...settings,
                      businessHours: { ...settings.businessHours, start: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={settings.businessHours.end}
                    onChange={(e) => setSettings({
                      ...settings,
                      businessHours: { ...settings.businessHours, end: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* n8n Connection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bot size={20} className="text-purple-600" />
              n8n Integration
            </h3>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <div>
                  <p className="font-medium text-gray-900">n8n Connected</p>
                  <p className="text-sm text-gray-500">http://n8n:5678</p>
                </div>
              </div>
              <a
                href="http://localhost:5678"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
              >
                Open n8n Dashboard
              </a>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-2">💡 How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create workflows in n8n Dashboard</li>
                <li>Use webhooks to trigger from WhatsApp, leads, reviews</li>
                <li>Connect to AI, Google Sheets, email, and more</li>
                <li>Workflows run automatically in the background</li>
              </ol>
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckCircle size={18} />
            Save Settings
          </button>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Choose Automation Template</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => useTemplate(template)}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition-all text-left"
                >
                  <div className="text-3xl">{template.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded mt-2 inline-block">
                      {template.category}
                    </span>
                  </div>
                  <ArrowRight size={20} className="text-gray-400 mt-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationPage;
