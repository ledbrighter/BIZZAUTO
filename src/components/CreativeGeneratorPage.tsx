import React, { useState } from 'react';
import {
  Download, Share2, Sparkles, Palette, Type, Image,
  Wand2, RefreshCw, Layout, Eye, Clock, Heart,
  ChevronRight, Sun, Moon, Zap, Copy, CheckCircle
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  category: string;
}

const TEMPLATES: Template[] = [
  { id: '1', name: 'Diwali Special', emoji: '🪔', gradient: 'from-orange-500 via-red-500 to-yellow-500', category: 'Festival' },
  { id: '2', name: 'Holi Colors', emoji: '🎨', gradient: 'from-pink-500 via-purple-500 to-blue-500', category: 'Festival' },
  { id: '3', name: 'Eid Mubarak', emoji: '🌙', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', category: 'Festival' },
  { id: '4', name: 'Christmas', emoji: '🎄', gradient: 'from-red-600 via-green-600 to-red-700', category: 'Festival' },
  { id: '5', name: 'Flash Sale', emoji: '⚡', gradient: 'from-blue-600 via-indigo-600 to-purple-600', category: 'Offer' },
  { id: '6', name: 'Grand Opening', emoji: '🏪', gradient: 'from-amber-500 via-orange-500 to-red-500', category: 'Offer' },
  { id: '7', name: 'New Arrival', emoji: '🆕', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', category: 'Product' },
  { id: '8', name: 'Summer Deal', emoji: '☀️', gradient: 'from-yellow-400 via-orange-400 to-red-400', category: 'Seasonal' },
  { id: '9', name: 'Monsoon Sale', emoji: '🌧️', gradient: 'from-slate-500 via-blue-500 to-indigo-500', category: 'Seasonal' },
];

const AI_HEADLINES = [
  '🔥 Mega Sale — Upto 70% OFF!',
  '✨ Limited Time Offer — Don\'t Miss Out!',
  '🎉 Celebrate With Amazing Deals!',
  '💥 Flash Sale — Today Only!',
  '🌟 Exclusive Offer Just For You!',
  '🎊 Big Savings — Shop Now!',
];

const AI_SUBTITLES = [
  'Your one-stop shop for the best deals in town',
  'Quality products at unbeatable prices',
  'Trusted by 10,000+ happy customers',
  'Free delivery on orders above ₹499',
  'Hurry! Offer valid while stocks last',
  'Shop smart, save big — every single day',
];

const COLOR_PALETTES = [
  { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFD700'] },
  { name: 'Ocean', colors: ['#0077B6', '#00B4D8', '#90E0EF'] },
  { name: 'Forest', colors: ['#2D6A4F', '#40916C', '#95D5B2'] },
  { name: 'Royal', colors: ['#7B2CBF', '#9D4EDD', '#C77DFF'] },
  { name: 'Cherry', colors: ['#D00000', '#E85D04', '#FFBA08'] },
  { name: 'Midnight', colors: ['#1B263B', '#415A77', '#778DA9'] },
];

const FONT_OPTIONS = [
  { name: 'Bold Sans', class: 'font-bold' },
  { name: 'Elegant', class: 'font-serif italic' },
  { name: 'Modern', class: 'font-light tracking-wider' },
  { name: 'Impact', class: 'font-black uppercase' },
];

const FORMAT_OPTIONS = [
  { name: 'Square', desc: '1080×1080', ratio: 'aspect-square' },
  { name: 'Story', desc: '1080×1920', ratio: 'aspect-[9/16]' },
  { name: 'Landscape', desc: '1200×628', ratio: 'aspect-[16/9]' },
];

const CreativeGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [activeView, setActiveView] = useState<'create' | 'history'>('create');
  const [headline, setHeadline] = useState('Diwali Sale');
  const [subtitle, setSubtitle] = useState('Flat 30% OFF on all services');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [businessName, setBusinessName] = useState('BizzAuto Solutions');
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [category, setCategory] = useState('Festival');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ id: number; name: string; date: string; emoji: string }[]>([
    { id: 1, name: 'Diwali Poster 2024', date: '2 hours ago', emoji: '🪔' },
    { id: 2, name: 'Flash Sale Banner', date: '1 day ago', emoji: '⚡' },
    { id: 3, name: 'New Arrival Post', date: '3 days ago', emoji: '🆕' },
  ]);

  const filteredTemplates = TEMPLATES.filter(t => t.category === category);

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setHeadline(AI_HEADLINES[Math.floor(Math.random() * AI_HEADLINES.length)]);
      setSubtitle(AI_SUBTITLES[Math.floor(Math.random() * AI_SUBTITLES.length)]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    setHistory(prev => [{ id: Date.now(), name: headline, date: 'Just now', emoji: selectedTemplate.emoji }, ...prev]);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Wand2 size={20} className="text-white" />
            </div>
            AI Creative Studio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 ml-13">Design stunning posters with AI-powered suggestions</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(['create', 'history'] as const).map(v => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === v
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              {v === 'create' ? 'Create' : 'History'}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* AI Quick Actions */}
            <div className="modern-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-purple-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  {isGenerating ? 'Generating...' : 'AI Generate'}
                </button>
                <button
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <Sparkles size={14} />
                  AI Headlines
                </button>
              </div>
              {showAIPanel && (
                <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
                  {AI_HEADLINES.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => { setHeadline(h); setShowAIPanel(false); }}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Template Selection */}
            <div className="modern-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layout size={18} className="text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Templates</h3>
              </div>
              {/* Category Tabs */}
              <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                {['Festival', 'Offer', 'Product', 'Seasonal'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      category === cat
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Template Grid */}
              <div className="grid grid-cols-3 gap-2">
                {filteredTemplates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      selectedTemplate.id === t.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Customize */}
            <div className="modern-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Type size={18} className="text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Customize</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Headline</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={headline}
                      onChange={e => setHeadline(e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button onClick={() => handleCopyText(headline)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="modern-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={18} className="text-orange-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Color Palette</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PALETTES.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPalette(i)}
                    className={`p-2 rounded-xl border-2 transition-all ${
                      selectedPalette === i
                        ? 'border-blue-500 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-0.5 mb-1">
                      {p.colors.map((c, ci) => (
                        <div key={ci} className="h-4 flex-1 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">{p.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Font */}
            <div className="modern-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Image size={18} className="text-cyan-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Format & Style</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {FORMAT_OPTIONS.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFormat(i)}
                        className={`p-2 rounded-xl border-2 text-center transition-all ${
                          selectedFormat === i
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{f.name}</p>
                        <p className="text-[10px] text-gray-400">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Font Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFont(i)}
                        className={`px-3 py-2 rounded-xl border-2 text-sm transition-all ${
                          selectedFont === i
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        } ${f.class} text-gray-700 dark:text-gray-300`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-8 space-y-4">
            {/* Preview Card */}
            <div className="modern-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-indigo-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Preview</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
                  Auto-updating
                </div>
              </div>

              {/* Poster Preview */}
              <div className="flex justify-center">
                <div className={`w-full max-w-lg ${FORMAT_OPTIONS[selectedFormat].ratio} bg-gradient-to-br ${selectedTemplate.gradient} rounded-2xl flex items-center justify-center p-8 relative shadow-2xl overflow-hidden`}>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    {selectedTemplate.emoji} {selectedTemplate.category}
                  </div>

                  <div className="text-center text-white z-10">
                    <div className="text-5xl mb-4">{selectedTemplate.emoji}</div>
                    <h2 className={`text-3xl md:text-4xl mb-3 ${FONT_OPTIONS[selectedFont].class}`}>
                      {headline}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 opacity-90">{subtitle}</p>
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold text-lg border border-white/30">
                      📞 {phone}
                    </div>
                    <p className="mt-4 text-sm opacity-75">{businessName}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Zap size={12} /> BizzAuto
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleSaveToHistory}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-medium text-sm"
                >
                  <Download size={16} />
                  Download PNG
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all font-medium text-sm">
                  <Share2 size={16} />
                  Share to WhatsApp
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all font-medium text-sm">
                  📷 Post to Social
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium text-sm">
                  <Heart size={16} />
                  Save Draft
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Image size={20} />, label: 'Posters Created', value: '24', color: 'from-blue-500 to-cyan-500' },
                { icon: <Share2 size={20} />, label: 'Shared', value: '18', color: 'from-green-500 to-emerald-500' },
                { icon: <Sparkles size={20} />, label: 'AI Generated', value: '12', color: 'from-purple-500 to-pink-500' },
              ].map((s, i) => (
                <div key={i} className="modern-card rounded-2xl p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="modern-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-gray-400" />
              Recent Creations
            </h3>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {history.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Download size={16} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Share2 size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeGeneratorPage;
