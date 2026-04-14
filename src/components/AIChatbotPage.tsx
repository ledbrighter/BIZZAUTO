import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Copy, CheckCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: string; }

const AI_RESPONSES: Record<string, string> = {
  default: "I'm your AI assistant! I can help with marketing strategies, content creation, customer support templates, and business analytics. What would you like to know?",
  marketing: "Here are 5 proven marketing strategies for small businesses:\n\n1. **WhatsApp Broadcasting** — Send personalized offers to your contact list\n2. **Social Media Content Calendar** — Plan posts 2 weeks ahead\n3. **Google Business Profile** — Keep it updated for local SEO\n4. **Referral Program** — Offer discounts for customer referrals\n5. **AI Chatbot** — Automate initial customer queries 24/7",
  poster: "I can help you create stunning posters! Here's what I suggest:\n\n🎨 **Design Tips:**\n- Use bold headlines with contrast colors\n- Keep it simple — one message per poster\n- Add your business logo & phone number\n- Use festival themes for seasonal campaigns\n\nWant me to generate a poster concept for you?",
  crm: "Here's how to improve your CRM workflow:\n\n📊 **Pipeline Optimization:**\n- Respond to new leads within 5 minutes\n- Use tags to prioritize hot leads\n- Set up auto-follow-up sequences\n- Track deal value at each stage\n\nYour current conversion rate is 23%. Industry average is 18%. You're doing great! 🎉",
  whatsapp: "WhatsApp Marketing best practices:\n\n💬 **Tips:**\n- Personalize messages with customer name\n- Send broadcasts during business hours (10am-7pm)\n- Use media (images/videos) for 2x better engagement\n- Always include a clear CTA\n- Don't spam — max 2-3 broadcasts per week\n\nYour WhatsApp open rate is 85% — that's excellent! 📈",
  analytics: "Your business analytics summary:\n\n📈 **This Week:**\n- Leads: 47 (+12% from last week)\n- Messages Sent: 1,234\n- Conversion Rate: 23%\n- Revenue: ₹2,45,000\n\n**Top performing channel:** WhatsApp (62% of leads)\n**Best time to post:** Tuesday 10 AM\n\nWould you like a detailed report?",
};

const getAIResponse = (msg: string): string => {
  const l = msg.toLowerCase();
  if (l.includes('market') || l.includes('promot') || l.includes('campaign')) return AI_RESPONSES.marketing;
  if (l.includes('poster') || l.includes('design') || l.includes('creative')) return AI_RESPONSES.poster;
  if (l.includes('crm') || l.includes('lead') || l.includes('pipeline') || l.includes('contact')) return AI_RESPONSES.crm;
  if (l.includes('whatsapp') || l.includes('message') || l.includes('broadcast')) return AI_RESPONSES.whatsapp;
  if (l.includes('analytic') || l.includes('report') || l.includes('stat') || l.includes('data')) return AI_RESPONSES.analytics;
  return AI_RESPONSES.default;
};

const SUGGESTIONS = ['Marketing tips', 'Poster ideas', 'CRM advice', 'WhatsApp strategy', 'Analytics report'];

const AIChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "👋 Hello! I'm your BizzAuto AI Assistant. I can help with marketing, CRM, WhatsApp campaigns, poster design, and business analytics. How can I help you today?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: getAIResponse(content), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{ id: '0', role: 'assistant', content: "👋 Chat cleared! How can I help you?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const toggleVoice = () => setIsListening(!isListening);
  const toggleSpeak = () => setIsSpeaking(!isSpeaking);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">BizzAuto AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot" />
              <span className="text-xs text-green-600 dark:text-green-400">Online — Ready to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleSpeak} className={`p-2 rounded-lg transition-colors ${isSpeaking ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`} title="Text-to-Speech">
            {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={clearChat} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Clear chat">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[70%] group relative ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-md shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-md shadow-sm border border-gray-100 dark:border-gray-700'}`}>
              <div className="px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <div className={`flex items-center justify-between px-4 pb-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                <span className="text-[10px]">{msg.timestamp}</span>
                <button onClick={() => copyMessage(msg.id, msg.content)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded">
                  {copiedId === msg.id ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 justify-start animate-fade-in-up">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0"><Bot size={16} className="text-white" /></div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-purple-500" /><span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Suggested prompts</span></div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all border border-blue-200/50 dark:border-blue-800/30">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={toggleVoice} className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-100 dark:bg-red-900/40 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`} title="Voice input">
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything about your business..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400 transition-all"
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotPage;
