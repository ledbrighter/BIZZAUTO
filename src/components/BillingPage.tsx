import React, { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle, ArrowUpRight, FileText, RefreshCw } from 'lucide-react';
import { billingAPI } from '../lib/api';
import { PageSkeleton } from './Skeleton';
import ConfirmDialog from './ConfirmDialog';

const BillingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  const currentPlan = subscription?.plan || { name: 'STARTER', price: '₹1,499', nextBilling: 'May 15, 2026', status: 'Active' };

  const fallbackInvoices = [
    { id: 'INV-2026-003', date: 'Apr 15, 2026', amount: '₹1,499', status: 'Paid', plan: 'Starter' },
    { id: 'INV-2026-002', date: 'Mar 15, 2026', amount: '₹1,499', status: 'Paid', plan: 'Starter' },
    { id: 'INV-2026-001', date: 'Feb 15, 2026', amount: '₹999', status: 'Paid', plan: 'Starter (Old Price)' },
  ];

  const usage = [
    { label: 'Contacts', used: 450, limit: 1000, pct: 45 },
    { label: 'WhatsApp Messages', used: 3200, limit: 5000, pct: 64 },
    { label: 'AI Credits', used: 45, limit: 100, pct: 45 },
    { label: 'Users', used: 2, limit: 3, pct: 67 },
  ];

  useEffect(() => {
    loadBilling();
  }, []);

  const loadBilling = async () => {
    try {
      setLoading(true);
      const [subRes, invRes] = await Promise.all([
        billingAPI.getCurrent().catch(() => null),
        billingAPI.getInvoices().catch(() => null),
      ]);
      if (subRes?.data?.data) setSubscription(subRes.data.data);
      if (invRes?.data?.data) setInvoices(invRes.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      await billingAPI.cancelSubscription();
    } catch {}
    setCancelling(false);
    setCancelDialogOpen(false);
  };

  if (loading) return <PageSkeleton />;

  const displayInvoices = invoices.length > 0 ? invoices : fallbackInvoices;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3"><CreditCard className="text-blue-600" size={32} />Billing & Subscription</h1>
          <p className="text-gray-600">Manage your plan, payment methods, and invoices</p>
        </div>
        <button onClick={loadBilling} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Current Plan</p>
            <h2 className="text-3xl font-bold mb-2">{currentPlan.name}</h2>
            <p className="text-blue-100">{currentPlan.price}/month - Next billing: {currentPlan.nextBilling}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <CheckCircle size={18} />
            <span className="font-medium">{currentPlan.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
          <div className="space-y-4">
            {usage.map((u, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{u.label}</span>
                  <span className="text-sm text-gray-500">{u.used.toLocaleString()} / {u.limit.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${u.pct > 80 ? 'bg-red-500' : u.pct > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${u.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">Upgrade Plan <ArrowUpRight size={14} /></button>
            <button onClick={() => setCancelDialogOpen(true)} className="text-red-600 text-sm font-medium hover:underline">Cancel Subscription</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
              <div>
                <p className="text-sm font-medium text-gray-900">.... 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2027</p>
              </div>
            </div>
          </div>
          <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Change Card</button>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Cycle</h4>
            <div className="flex gap-2">
              {(['monthly', 'yearly'] as const).map(c => (
                <button key={c} onClick={() => setBillingCycle(c)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {c === 'monthly' ? 'Monthly' : 'Yearly (Save 20%)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period."
        confirmLabel="Cancel Subscription"
        variant="danger"
        loading={cancelling}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {displayInvoices.map((inv: any) => (
            <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600"><FileText size={18} /></div>
                <div>
                  <p className="font-medium text-gray-900">{inv.id}</p>
                  <p className="text-sm text-gray-500">{inv.date} - {inv.plan}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">{inv.amount}</span>
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} />Paid</span>
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Download size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;