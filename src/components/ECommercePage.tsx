import React, { useState } from 'react';
import { Plus, Search, Package, ShoppingCart, TrendingUp, Eye, Edit, Trash2, Share2, X, MessageSquare } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  category: string;
  stock: number;
  image: string;
  status: 'active' | 'draft' | 'archived';
  sku: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  paymentMethod: string;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Premium Hair Oil', price: 499, comparePrice: 699, category: 'Hair Care', stock: 150, image: '🧴', status: 'active', sku: 'HC-001' },
  { id: '2', name: 'Organic Face Wash', price: 299, category: 'Skin Care', stock: 80, image: '🧼', status: 'active', sku: 'SC-002' },
  { id: '3', name: 'Herbal Shampoo', price: 349, comparePrice: 449, category: 'Hair Care', stock: 200, image: '🧴', status: 'active', sku: 'HC-003' },
  { id: '4', name: 'Body Lotion - Lavender', price: 399, category: 'Skin Care', stock: 0, image: '🧴', status: 'draft', sku: 'SC-004' },
  { id: '5', name: 'Anti-Aging Cream', price: 899, comparePrice: 1299, category: 'Premium', stock: 45, image: '✨', status: 'active', sku: 'PM-005' },
  { id: '6', name: 'Sunscreen SPF 50', price: 549, category: 'Skin Care', stock: 120, image: '☀️', status: 'active', sku: 'SC-006' },
];

const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD-001', customerName: 'Rahul Sharma', phone: '+91 98765 43210', items: 2, total: 998, status: 'confirmed', date: '2026-04-12', paymentMethod: 'UPI' },
  { id: '2', orderNumber: 'ORD-002', customerName: 'Priya Patel', phone: '+91 98765 43211', items: 1, total: 299, status: 'pending', date: '2026-04-12', paymentMethod: 'COD' },
  { id: '3', orderNumber: 'ORD-003', customerName: 'Amit Kumar', phone: '+91 98765 43212', items: 3, total: 1847, status: 'shipped', date: '2026-04-11', paymentMethod: 'Card' },
  { id: '4', orderNumber: 'ORD-004', customerName: 'Sneha Reddy', phone: '+91 98765 43213', items: 1, total: 899, status: 'delivered', date: '2026-04-10', paymentMethod: 'UPI' },
  { id: '5', orderNumber: 'ORD-005', customerName: 'Vikram Singh', phone: '+91 98765 43214', items: 2, total: 698, status: 'cancelled', date: '2026-04-09', paymentMethod: 'COD' },
];

const orderStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const productStatusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  archived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
};

const ECommercePage: React.FC = () => {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = mockOrders.filter(o =>
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = mockOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = mockOrders.length;
  const activeProducts = mockProducts.filter(p => p.status === 'active').length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">E-Commerce</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage products, orders, and share via WhatsApp</p>
        </div>
        <button
          onClick={() => setShowProductModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' },
          { label: 'Orders', value: totalOrders, icon: <ShoppingCart size={20} />, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
          { label: 'Active Products', value: activeProducts, icon: <Package size={20} />, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
          { label: 'Pending Orders', value: pendingOrders, icon: <Eye size={20} />, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
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
        <button
          onClick={() => setTab('products')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'products' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-transparent'}`}
        >
          <Package size={16} className="inline mr-2" />Products ({mockProducts.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'orders' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-transparent'}`}
        >
          <ShoppingCart size={16} className="inline mr-2" />Orders ({mockOrders.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={tab === 'products' ? 'Search products...' : 'Search orders...'}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {tab === 'products' ? (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{product.image}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${productStatusColors[product.status]}`}>
                  {product.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-400 line-through">₹{product.comparePrice}</span>
                )}
                {product.comparePrice && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {Math.round((1 - product.price / product.comparePrice) * 100)}% off
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{product.category}</span>
                <span className={product.stock === 0 ? 'text-red-500 font-medium' : ''}>
                  {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-sm font-medium">
                  <Share2 size={14} /> Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm font-medium">
                  <MessageSquare size={14} /> WhatsApp
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Edit size={14} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Orders Table */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="View">
                        <Eye size={14} className="text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded" title="Send on WhatsApp">
                        <MessageSquare size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Product</h2>
              <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                <input type="text" placeholder="e.g. Premium Hair Oil" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input type="number" placeholder="499" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compare Price (₹)</label>
                  <input type="number" placeholder="699" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option>Hair Care</option>
                    <option>Skin Care</option>
                    <option>Premium</option>
                    <option>Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                  <input type="number" placeholder="100" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                <input type="text" placeholder="HC-001" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} placeholder="Product description..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowProductModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={() => setShowProductModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ECommercePage;
