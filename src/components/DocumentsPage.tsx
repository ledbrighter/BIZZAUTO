import React, { useState } from 'react';
import { Plus, Search, FileText, Download, Send, Eye, Edit, Trash2, X, Copy, Check, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface Document {
  id: string;
  docNumber: string;
  title: string;
  type: 'quote' | 'invoice' | 'proposal';
  contactName: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'paid' | 'expired' | 'declined';
  createdAt: string;
  validUntil?: string;
  items: { description: string; qty: number; rate: number; amount: number }[];
}

const mockDocuments: Document[] = [
  {
    id: '1', docNumber: 'QUO-001', title: 'Website Redesign Quote', type: 'quote', contactName: 'Rahul Sharma', amount: 75000,
    status: 'sent', createdAt: '2026-04-10', validUntil: '2026-04-24',
    items: [{ description: 'UI/UX Design', qty: 1, rate: 25000, amount: 25000 }, { description: 'Development', qty: 1, rate: 40000, amount: 40000 }, { description: 'Testing & Launch', qty: 1, rate: 10000, amount: 10000 }]
  },
  {
    id: '2', docNumber: 'INV-001', title: 'Monthly Retainer - March', type: 'invoice', contactName: 'Priya Patel', amount: 25000,
    status: 'paid', createdAt: '2026-04-01',
    items: [{ description: 'Social Media Management', qty: 1, rate: 15000, amount: 15000 }, { description: 'WhatsApp Campaigns', qty: 1, rate: 10000, amount: 10000 }]
  },
  {
    id: '3', docNumber: 'PRO-001', title: 'Digital Marketing Proposal', type: 'proposal', contactName: 'Amit Kumar', amount: 150000,
    status: 'viewed', createdAt: '2026-04-08', validUntil: '2026-04-22',
    items: [{ description: 'SEO Optimization', qty: 1, rate: 50000, amount: 50000 }, { description: 'PPC Campaigns (3 months)', qty: 3, rate: 25000, amount: 75000 }, { description: 'Content Strategy', qty: 1, rate: 25000, amount: 25000 }]
  },
  {
    id: '4', docNumber: 'INV-002', title: 'Product Catalog Design', type: 'invoice', contactName: 'Sneha Reddy', amount: 18000,
    status: 'sent', createdAt: '2026-04-05',
    items: [{ description: 'Catalog Design (20 pages)', qty: 1, rate: 18000, amount: 18000 }]
  },
  {
    id: '5', docNumber: 'QUO-002', title: 'WhatsApp Bot Setup', type: 'quote', contactName: 'Vikram Singh', amount: 45000,
    status: 'accepted', createdAt: '2026-04-03', validUntil: '2026-04-17',
    items: [{ description: 'Chatbot Flow Design', qty: 1, rate: 15000, amount: 15000 }, { description: 'API Integration', qty: 1, rate: 20000, amount: 20000 }, { description: 'Training & Support', qty: 1, rate: 10000, amount: 10000 }]
  },
  {
    id: '6', docNumber: 'INV-003', title: 'Logo & Branding Package', type: 'invoice', contactName: 'Neha Gupta', amount: 35000,
    status: 'draft', createdAt: '2026-04-12',
    items: [{ description: 'Logo Design', qty: 1, rate: 20000, amount: 20000 }, { description: 'Brand Guidelines', qty: 1, rate: 15000, amount: 15000 }]
  },
];

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  viewed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  expired: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  declined: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  quote: { icon: <FileText size={16} />, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800', label: 'Quote' },
  invoice: { icon: <DollarSign size={16} />, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800', label: 'Invoice' },
  proposal: { icon: <Copy size={16} />, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800', label: 'Proposal' },
};

const DocumentsPage: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'quote' | 'invoice' | 'proposal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  const filtered = mockDocuments
    .filter(d => tab === 'all' || d.type === tab)
    .filter(d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalQuotes = mockDocuments.filter(d => d.type === 'quote');
  const totalInvoiced = mockDocuments.filter(d => d.type === 'invoice').reduce((s, d) => s + d.amount, 0);
  const totalPaid = mockDocuments.filter(d => d.type === 'invoice' && d.status === 'paid').reduce((s, d) => s + d.amount, 0);
  const pendingAmount = totalInvoiced - totalPaid;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Documents</h1>
          <p className="text-gray-600 dark:text-gray-400">Create quotes, invoices, and proposals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> New Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Invoiced', value: `₹${totalInvoiced.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          { label: 'Paid', value: `₹${totalPaid.toLocaleString()}`, icon: <Check size={20} />, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' },
          { label: 'Pending', value: `₹${pendingAmount.toLocaleString()}`, icon: <Clock size={20} />, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
          { label: 'Open Quotes', value: totalQuotes.filter(q => q.status === 'sent').length, icon: <TrendingUp size={20} />, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-80">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {(['all', 'quote', 'invoice', 'proposal'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-transparent'}`}
          >
            {t === 'all' ? 'All' : `${t}s`} ({t === 'all' ? mockDocuments.length : mockDocuments.filter(d => d.type === t).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map(doc => {
          const cfg = typeConfig[doc.type];
          const isExpanded = expandedDoc === doc.id;
          return (
            <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${cfg.color} border flex items-center justify-center`}>
                      {cfg.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{doc.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.docNumber} • {doc.contactName} • {doc.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">₹{doc.amount.toLocaleString()}</p>
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="View">
                        <Eye size={16} className="text-gray-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Edit">
                        <Edit size={16} className="text-gray-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); }} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg" title="Send">
                        <Send size={16} className="text-gray-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Download PDF">
                        <Download size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded items */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-750">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Line Items</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                        <th className="text-left pb-2">Description</th>
                        <th className="text-right pb-2">Qty</th>
                        <th className="text-right pb-2">Rate</th>
                        <th className="text-right pb-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doc.items.map((item, idx) => (
                        <tr key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                          <td className="py-1.5">{item.description}</td>
                          <td className="text-right py-1.5">{item.qty}</td>
                          <td className="text-right py-1.5">₹{item.rate.toLocaleString()}</td>
                          <td className="text-right py-1.5 font-medium">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-900 dark:text-white">
                        <td colSpan={3} className="pt-2 text-right">Total:</td>
                        <td className="pt-2 text-right">₹{doc.amount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                  {doc.validUntil && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Valid until: {doc.validUntil}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Document</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Document type selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      className={`p-3 rounded-lg border-2 text-center capitalize transition-colors ${key === 'quote' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}
                    >
                      <div className="flex justify-center mb-1">{cfg.icon}</div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" placeholder="e.g. Website Redesign Quote" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
                <input type="text" placeholder="Search contacts..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valid Until</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>
              {/* Line items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Line Items</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2">
                    <input type="text" placeholder="Description" className="col-span-6 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder="Qty" className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder="Rate" className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500" />
                    <button className="col-span-1 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add Line Item
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea rows={2} placeholder="Payment terms, additional notes..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
