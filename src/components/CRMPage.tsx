import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, MoreVertical, Mail, Phone, Tag, Edit3, Trash2, Eye, UserPlus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  tags: string[];
  stage: string;
  dealValue: number;
  lastActivity: string;
  avatar: string;
  createdAt: string;
}

const STAGES = ['New Lead', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Contacted': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Qualified': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Proposal': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Won': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Lost': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@email.com', company: 'Sharma Traders', tags: ['Hot Lead', 'Mumbai'], stage: 'Contacted', dealValue: 50000, lastActivity: '2 min ago', avatar: 'RS', createdAt: '2024-01-15' },
  { id: '2', name: 'Priya Patel', phone: '+91 87654 32109', email: 'priya@email.com', company: 'Patel Industries', tags: ['New Lead'], stage: 'New Lead', dealValue: 25000, lastActivity: '1 hour ago', avatar: 'PP', createdAt: '2024-01-14' },
  { id: '3', name: 'Amit Kumar', phone: '+91 76543 21098', email: 'amit@email.com', company: 'Kumar Enterprises', tags: ['VIP', 'Delhi'], stage: 'Qualified', dealValue: 100000, lastActivity: '3 hours ago', avatar: 'AK', createdAt: '2024-01-13' },
  { id: '4', name: 'Sneha Reddy', phone: '+91 65432 10987', email: 'sneha@email.com', company: 'Reddy Solutions', tags: ['Won'], stage: 'Won', dealValue: 75000, lastActivity: '1 day ago', avatar: 'SR', createdAt: '2024-01-12' },
  { id: '5', name: 'Vikram Singh', phone: '+91 54321 09876', email: 'vikram@email.com', company: 'Singh & Co', tags: ['Bangalore'], stage: 'Proposal', dealValue: 200000, lastActivity: '2 days ago', avatar: 'VS', createdAt: '2024-01-11' },
  { id: '6', name: 'Meera Joshi', phone: '+91 43210 98765', email: 'meera@email.com', company: 'Joshi Tech', tags: ['Customer', 'Pune'], stage: 'Won', dealValue: 60000, lastActivity: '3 days ago', avatar: 'MJ', createdAt: '2024-01-10' },
  { id: '7', name: 'Karan Malhotra', phone: '+91 32109 87654', email: 'karan@email.com', company: 'Malhotra Group', tags: ['Lead'], stage: 'New Lead', dealValue: 150000, lastActivity: '4 days ago', avatar: 'KM', createdAt: '2024-01-09' },
  { id: '8', name: 'Deepa Nair', phone: '+91 21098 76543', email: 'deepa@email.com', company: 'Nair Associates', tags: ['Lost'], stage: 'Lost', dealValue: 40000, lastActivity: '1 week ago', avatar: 'DN', createdAt: '2024-01-08' },
];

export default function CRMPage() {
  const navigate = useNavigate();
  const { business } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', company: '', tags: '' });

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === 'all' || c.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [contacts, search, stageFilter]);

  const pipelineContacts = useMemo(() => {
    const map: Record<string, Contact[]> = {};
    STAGES.forEach(s => map[s] = []);
    filtered.forEach(c => {
      if (map[c.stage]) map[c.stage].push(c);
      else map['New Lead'].push(c);
    });
    return map;
  }, [filtered]);

  const totalValue = filtered.reduce((sum, c) => sum + c.dealValue, 0);
  const wonValue = contacts.filter(c => c.stage === 'Won').reduce((sum, c) => sum + c.dealValue, 0);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      company: newContact.company,
      tags: newContact.tags.split(',').map(t => t.trim()).filter(Boolean),
      stage: 'New Lead',
      dealValue: 0,
      lastActivity: 'Just now',
      avatar: newContact.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    setContacts(prev => [contact, ...prev]);
    setNewContact({ name: '', phone: '', email: '', company: '', tags: '' });
    setShowAddModal(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedContact(null);
  };

  const handleStageChange = (contactId: string, newStage: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, stage: newStage } : c));
  };

  return (
    <div className="p-6 lg:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM & Contacts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{business?.name || 'Your Business'} — {filtered.length} contacts, ₹{totalValue.toLocaleString()} in pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/bulk-import')} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload size={16} /> Import
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
            <Plus size={16} /> Add Contact
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
        {[
          { label: 'Total Contacts', value: contacts.length, icon: <UserPlus size={20} />, color: 'blue' },
          { label: 'Pipeline Value', value: `₹${totalValue.toLocaleString()}`, icon: <Tag size={20} />, color: 'purple' },
          { label: 'Won Deals', value: `₹${wonValue.toLocaleString()}`, icon: <Eye size={20} />, color: 'green' },
          { label: 'Conversion', value: contacts.length > 0 ? `${Math.round((contacts.filter(c => c.stage === 'Won').length / contacts.length) * 100)}%` : '0%', icon: <Filter size={20} />, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="modern-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : stat.color === 'purple' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : stat.color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="all">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>Table</button>
          <button onClick={() => setViewMode('pipeline')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === 'pipeline' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>Pipeline</button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="modern-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Stage</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Deal Value</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Tags</th>
                  <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Last Activity</th>
                  <th className="text-right py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(contact => (
                  <tr key={contact.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">{contact.avatar}</div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{contact.phone}</td>
                    <td className="py-3 px-4">
                      <select value={contact.stage} onChange={e => handleStageChange(contact.id, e.target.value)} className={`text-xs px-2 py-1 rounded-lg border-0 cursor-pointer ${STAGE_COLORS[contact.stage] || 'bg-gray-100 text-gray-600'}`}>
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">₹{contact.dealValue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">{contact.lastActivity}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedContact(contact)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-gray-600"><Eye size={14} /></button>
                        <button onClick={() => handleDeleteContact(contact.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">No contacts found</div>
            )}
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <div key={stage} className="min-w-[250px] flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{stage}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{pipelineContacts[stage]?.length || 0}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {pipelineContacts[stage]?.map(contact => (
                  <div key={contact.id} className="modern-card rounded-xl p-3 cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedContact(contact)}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-[10px]">{contact.avatar}</div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{contact.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{contact.company}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{contact.dealValue.toLocaleString()}</p>
                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] rounded">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Contact</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><MoreVertical size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input type="text" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                <input type="tel" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="email@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                <input type="text" value={newContact.company} onChange={e => setNewContact({ ...newContact, company: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Company name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                <input type="text" value={newContact.tags} onChange={e => setNewContact({ ...newContact, tags: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="VIP, Mumbai, Hot Lead" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">Cancel</button>
                <button onClick={handleAddContact} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">Add Contact</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedContact(null)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">{selectedContact.avatar}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedContact.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{selectedContact.company}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-gray-400" /><span className="text-gray-700 dark:text-gray-300">{selectedContact.phone}</span></div>
                <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400" /><span className="text-gray-700 dark:text-gray-300">{selectedContact.email || 'No email'}</span></div>
                <div className="flex items-center gap-3 text-sm"><Tag size={16} className="text-gray-400" /><span className={`px-2 py-1 rounded-lg text-xs ${STAGE_COLORS[selectedContact.stage]}`}>{selectedContact.stage}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Deal Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedContact.dealValue.toLocaleString()}</p>
              </div>
              <div className="flex gap-2 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"><Phone size={16} /> Call</button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"><Mail size={16} /> Email</button>
                <button onClick={() => handleDeleteContact(selectedContact.id)} className="flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
