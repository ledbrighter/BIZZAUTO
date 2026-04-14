import React, { useState } from 'react';
import { MapPin, Star, Phone, Clock, Globe, Camera, Edit3, MessageSquare, Eye, Plus, CheckCircle, XCircle, AlertCircle, BarChart3, Share2, ExternalLink, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RT, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Review { id: string; author: string; rating: number; text: string; date: string; replied: boolean; replyText?: string; }
interface BusinessPost { id: string; type: 'update' | 'offer' | 'event'; title: string; content: string; startDate: string; endDate?: string; status: 'active' | 'expired'; views: number; clicks: number; }

const P = { name: 'BizzAuto Solutions', category: 'Software Company', address: '123 Business Hub, Andheri East, Mumbai 400069', phone: '+91 98765 43210', website: 'https://bizzauto.com', description: "India's #1 WhatsApp Marketing & Business Automation Platform.", hours: { Mon: { o: '09:00', c: '18:00' }, Tue: { o: '09:00', c: '18:00' }, Wed: { o: '09:00', c: '18:00' }, Thu: { o: '09:00', c: '18:00' }, Fri: { o: '09:00', c: '18:00' }, Sat: { o: '10:00', c: '14:00' }, Sun: { o: '', c: '' } }, photos: 24, avgRating: 4.6, totalReviews: 128, isVerified: true };

const initReviews: Review[] = [
  { id: '1', author: 'Rahul Sharma', rating: 5, text: 'Amazing platform! Our sales increased by 200%.', date: '2 days ago', replied: true, replyText: 'Thank you Rahul! 🎉' },
  { id: '2', author: 'Priya Patel', rating: 4, text: 'Great tool for small businesses. Would love more integrations.', date: '1 week ago', replied: true, replyText: 'Thanks Priya! More coming soon!' },
  { id: '3', author: 'Amit Kumar', rating: 5, text: 'Best investment for our business this year.', date: '2 weeks ago', replied: false },
  { id: '4', author: 'Sneha Reddy', rating: 3, text: 'Good platform but learning curve is steep.', date: '3 weeks ago', replied: true, replyText: 'We appreciate your feedback!' },
  { id: '5', author: 'Vikram Singh', rating: 5, text: 'Lead generation feature alone pays for itself!', date: '1 month ago', replied: false },
];

const initPosts: BusinessPost[] = [
  { id: '1', type: 'offer', title: '🎉 Diwali Special - 40% OFF', content: 'Get flat 40% off on all premium plans!', startDate: 'Oct 20, 2026', endDate: 'Nov 5, 2026', status: 'active', views: 2450, clicks: 180 },
  { id: '2', type: 'update', title: 'New Feature: AI Chatbot', content: 'AI-powered chatbot that handles queries 24/7.', startDate: 'Oct 15, 2026', status: 'active', views: 1890, clicks: 245 },
  { id: '3', type: 'event', title: 'Free Webinar: WhatsApp Marketing', content: 'Join our free webinar on WhatsApp for business.', startDate: 'Nov 1, 2026', status: 'active', views: 3200, clicks: 420 },
  { id: '4', type: 'offer', title: 'Summer Sale - 30% OFF', content: '30% off on annual plans.', startDate: 'May 1, 2026', endDate: 'May 31, 2026', status: 'expired', views: 5600, clicks: 380 },
];

const searchData = [{ name: 'Jan', direct: 450, discovery: 890 }, { name: 'Feb', direct: 520, discovery: 950 }, { name: 'Mar', direct: 610, discovery: 1100 }, { name: 'Apr', direct: 580, discovery: 1050 }, { name: 'May', direct: 720, discovery: 1280 }, { name: 'Jun', direct: 850, discovery: 1420 }];
const callData = [{ name: 'Mon', calls: 12 }, { name: 'Tue', calls: 18 }, { name: 'Wed', calls: 15 }, { name: 'Thu', calls: 22 }, { name: 'Fri', calls: 28 }, { name: 'Sat', calls: 8 }, { name: 'Sun', calls: 3 }];
const ratingDist = [{ name: '5⭐', value: 78 }, { name: '4⭐', value: 32 }, { name: '3⭐', value: 12 }, { name: '2⭐', value: 4 }, { name: '1⭐', value: 2 }];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const GoogleBusinessPage: React.FC = () => {
  const [view, setView] = useState<'profile' | 'reviews' | 'posts' | 'insights'>('profile');
  const [reviews, setReviews] = useState(initReviews);
  const [posts, setPosts] = useState(initPosts);
  const [editOpen, setEditOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyTxt, setReplyTxt] = useState('');
  const [postOpen, setPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ type: 'update' as const, title: '', content: '', startDate: '' });
  const [editForm, setEditForm] = useState({ name: P.name, phone: P.phone, website: P.website, description: P.description });
  const [toast, setToast] = useState<{ m: string; t: string } | null>(null);

  const toast_ = (m: string) => { setToast({ m, t: 'success' }); setTimeout(() => setToast(null), 3000); };
  const handleReply = (id: string) => { if (!replyTxt.trim()) return; setReviews(reviews.map(r => r.id === id ? { ...r, replied: true, replyText: replyTxt } : r)); setReplyOpen(null); setReplyTxt(''); toast_('Reply posted!'); };
  const handleCreatePost = () => { if (!newPost.title.trim()) return; setPosts([{ id: Date.now().toString(), ...newPost, status: 'active', views: 0, clicks: 0 }, ...posts]); setNewPost({ type: 'update', title: '', content: '', startDate: '' }); setPostOpen(false); toast_('Post created!'); };

  const Stars: React.FC<{ r: number; sz?: number }> = ({ r, sz = 18 }) => <div className="flex items-center justify-center gap-1">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={sz} className={s <= r ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} />)}</div>;

  return (
    <div className="p-6 lg:p-8">
      {toast && <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white bg-green-500">{toast.m}</div>}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Google Business Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your business on Google Search & Maps</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['profile', 'reviews', 'posts', 'insights'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {v === 'profile' && <><MapPin size={14} className="inline mr-1" />Profile</>}
              {v === 'reviews' && <><Star size={14} className="inline mr-1" />Reviews</>}
              {v === 'posts' && <><MessageSquare size={14} className="inline mr-1" />Posts</>}
              {v === 'insights' && <><BarChart3 size={14} className="inline mr-1" />Insights</>}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Badge */}
      <div className="mb-6 p-4 rounded-xl flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
        <div><p className="font-medium text-green-800 dark:text-green-300">Business Verified ✓</p><p className="text-sm text-green-600 dark:text-green-400">Your business is verified on Google</p></div>
      </div>

      {/* ===== PROFILE ===== */}
      {view === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">{P.name}</h2><p className="text-gray-500 dark:text-gray-400">{P.category}</p></div>
                <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"><Edit3 size={14} /> Edit</button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{P.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3"><MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" /><div><p className="text-sm font-medium text-gray-900 dark:text-white">Address</p><p className="text-sm text-gray-500 dark:text-gray-400">{P.address}</p></div></div>
                <div className="flex items-start gap-3"><Phone size={18} className="text-gray-400 mt-0.5 shrink-0" /><div><p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p><p className="text-sm text-gray-500 dark:text-gray-400">{P.phone}</p></div></div>
                <div className="flex items-start gap-3"><Globe size={18} className="text-gray-400 mt-0.5 shrink-0" /><div><p className="text-sm font-medium text-gray-900 dark:text-white">Website</p><a href={P.website} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{P.website}</a></div></div>
                <div className="flex items-start gap-3"><Camera size={18} className="text-gray-400 mt-0.5 shrink-0" /><div><p className="text-sm font-medium text-gray-900 dark:text-white">Photos</p><p className="text-sm text-gray-500 dark:text-gray-400">{P.photos} photos uploaded</p></div></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Clock size={18} /> Business Hours</h3>
              <div className="space-y-2">
                {days.map(d => { const h = P.hours[d as keyof typeof P.hours]; return <div key={d} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0"><span className="text-sm font-medium text-gray-900 dark:text-white w-16">{d}</span>{h?.o && h?.c ? <span className="text-sm text-gray-600 dark:text-gray-400">{h.o} - {h.c}</span> : <span className="text-sm text-red-500">Closed</span>}</div>; })}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">{P.avgRating}</div>
              <Stars r={Math.round(P.avgRating)} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{P.totalReviews} reviews</p>
              <button onClick={() => setView('reviews')} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">View all reviews →</button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {[{ i: <Search size={14} />, l: 'Search Views', v: '3,420' }, { i: <Phone size={14} />, l: 'Phone Calls', v: '186' }, { i: <ExternalLink size={14} />, l: 'Website Clicks', v: '412' }, { i: <MapPin size={14} />, l: 'Directions', v: '95' }].map((s, i) => (
                  <div key={i} className="flex items-center justify-between"><span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">{s.i} {s.l}</span><span className="text-sm font-semibold text-gray-900 dark:text-white">{s.v}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => setPostOpen(true)} className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 text-sm font-medium"><Plus size={16} /> Create Post</button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 text-sm font-medium"><Camera size={16} /> Add Photos</button>
                <button onClick={() => setView('reviews')} className="w-full flex items-center gap-2 px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-sm font-medium"><Star size={16} /> Respond to Reviews</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== REVIEWS ===== */}
      {view === 'reviews' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{P.avgRating}</div>
              <Stars r={Math.round(P.avgRating)} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{P.totalReviews} total reviews</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Rating Distribution</h4>
              {ratingDist.map(r => <div key={r.name} className="flex items-center gap-2 mb-1.5"><span className="text-xs text-gray-600 dark:text-gray-400 w-6">{r.name}</span><div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(r.value / P.totalReviews) * 100}%` }} /></div><span className="text-xs text-gray-500 dark:text-gray-400 w-6">{r.value}</span></div>)}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Response Rate</h4>
              <div className="text-center"><div className="text-4xl font-bold text-green-600 dark:text-green-400">{Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100)}%</div><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reviews.filter(r => r.replied).length} of {reviews.length} replied</p></div>
              {reviews.filter(r => !r.replied).length > 0 && <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"><p className="text-xs text-yellow-700 dark:text-yellow-400">⚠️ {reviews.filter(r => !r.replied).length} review(s) awaiting reply</p></div>}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700"><h3 className="font-semibold text-gray-900 dark:text-white">All Reviews</h3></div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {reviews.map(rv => (
                <div key={rv.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{rv.author.charAt(0)}</div>
                      <div><p className="font-medium text-gray-900 dark:text-white">{rv.author}</p><div className="flex items-center gap-2"><Stars r={rv.rating} sz={12} /><span className="text-xs text-gray-400">{rv.date}</span></div></div>
                    </div>
                    {!rv.replied && <button onClick={() => { setReplyOpen(rv.id); setReplyTxt(''); }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Reply</button>}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{rv.text}</p>
                  {rv.replied && rv.replyText && <div className="mt-3 ml-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400"><p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Owner Response</p><p className="text-sm text-gray-700 dark:text-gray-300">{rv.replyText}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== POSTS ===== */}
      {view === 'posts' && (
        <div className="space-y-6">
          <div className="flex justify-end"><button onClick={() => setPostOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={18} /> Create Post</button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.type === 'offer' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : p.type === 'event' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>{p.type === 'offer' ? '🏷️ Offer' : p.type === 'event' ? '📅 Event' : '📝 Update'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{p.status}</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{p.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{p.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500"><span>{p.startDate}{p.endDate ? ` - ${p.endDate}` : ''}</span><div className="flex items-center gap-3"><span className="flex items-center gap-1"><Eye size={12} /> {p.views}</span><span className="flex items-center gap-1"><Share2 size={12} /> {p.clicks}</span></div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== INSIGHTS ===== */}
      {view === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[{ i: <Search size={20} />, l: 'Search Views', v: '3,420', c: '+22%', cl: 'blue' }, { i: <Phone size={20} />, l: 'Phone Calls', v: '186', c: '+15%', cl: 'green' }, { i: <ExternalLink size={20} />, l: 'Website Clicks', v: '412', c: '+28%', cl: 'purple' }, { i: <MapPin size={20} />, l: 'Directions', v: '95', c: '+8%', cl: 'orange' }].map((s, i) => {
              const cm: Record<string, string> = { blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400', purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' };
              return <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700"><div className="flex items-center justify-between mb-3"><div className={`p-2.5 rounded-lg ${cm[s.cl]}`}>{s.i}</div><span className="text-xs font-medium text-green-600 dark:text-green-400">{s.c}</span></div><p className="text-2xl font-bold text-gray-900 dark:text-white">{s.v}</p><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.l}</p></div>;
            })}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Search Performance</h3>
              <ResponsiveContainer width="100%" height={280}><BarChart data={searchData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><RT /><Bar dataKey="direct" fill="#3B82F6" name="Direct" radius={[4, 4, 0, 0]} /><Bar dataKey="discovery" fill="#10B981" name="Discovery" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Phone Calls by Day</h3>
              <ResponsiveContainer width="100%" height={280}><LineChart data={callData}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" stroke="#9CA3AF" /><YAxis stroke="#9CA3AF" /><RT /><Line type="monotone" dataKey="calls" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Actions (Last 30 Days)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[{ l: 'Visited Website', v: 412, i: <Globe size={20} /> }, { l: 'Called', v: 186, i: <Phone size={20} /> }, { l: 'Directions', v: 95, i: <MapPin size={20} /> }, { l: 'Viewed Photos', v: 1280, i: <Camera size={20} /> }, { l: 'Sent Message', v: 67, i: <MessageSquare size={20} /> }].map((a, i) => (
                <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><div className="text-gray-400 dark:text-gray-500 flex justify-center mb-2">{a.i}</div><p className="text-xl font-bold text-gray-900 dark:text-white">{a.v}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{a.l}</p></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditOpen(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Business Profile</h2>
              <button onClick={() => setEditOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><XCircle size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label><input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label><input type="text" value={editForm.website} onChange={e => setEditForm({ ...editForm, website: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label><textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" /></div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => setEditOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={() => { setEditOpen(false); toast_('Profile updated!'); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== REPLY MODAL ===== */}
      {replyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setReplyOpen(null)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reply to Review</h2>
              <button onClick={() => setReplyOpen(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><XCircle size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">{reviews.find(r => r.id === replyOpen)?.text}</p>
                <p className="text-xs text-gray-400 mt-1">— {reviews.find(r => r.id === replyOpen)?.author}</p>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Reply</label><textarea value={replyTxt} onChange={e => setReplyTxt(e.target.value)} rows={3} placeholder="Write your response..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" /></div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setReplyOpen(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={() => handleReply(replyOpen)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Post Reply</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATE POST MODAL ===== */}
      {postOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPostOpen(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Post</h2>
              <button onClick={() => setPostOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><XCircle size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Type</label>
                <select value={newPost.type} onChange={e => setNewPost({ ...newPost, type: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="update">📝 Update</option>
                  <option value="offer">🏷️ Offer</option>
                  <option value="event">📅 Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input type="text" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="Post title" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={3} placeholder="Write your post content..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input type="date" value={newPost.startDate} onChange={e => setNewPost({ ...newPost, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => setPostOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={handleCreatePost} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleBusinessPage;