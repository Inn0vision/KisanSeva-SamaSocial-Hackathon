import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from 'react-i18next'

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What fertilizer is best for Soybean right now?",
  "How much water does my crop need today?",
  "Tell me about latest Govt Schemes for Maharashtra",
  "Is there any pest risk in my area?"
];

export default function Chat() {
  const { profile } = useAuthStore();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content: `Hello ${profile?.name?.split(' ')[0] || 'there'}! I'm your KisanSeva AI Assistant. I can help you with crop management, weather forecasts, disease detection, and government schemes. What would you like to know today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateResponse = (userMsg: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const assistantMsg: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Based on your profile (farming in ${profile?.city || 'India'}), and current weather conditions, here is some tailored advice regarding "${userMsg}":\n\n1. Ensure adequate soil moisture.\n2. Monitor for common pests early in the morning.\n3. Apply organic fertilizers if you haven't in the last 14 days.\n\nLet me know if you need specific details!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 2500);
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    simulateResponse(text);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center text-white shadow-green-glow dark:shadow-[0_0_20px_rgba(63,185,80,0.20)]">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3] flex items-center gap-2">
            {t('AI Assistant')} <Sparkles size={18} className="text-[#16a34a]" />
          </h1>
          <p className="text-sm text-[#6b7280] dark:text-[#8b949e]">{t('Personalized farming intelligence')}</p>
        </div>
      </div>

      <div className="flex-1 card-base flex flex-col overflow-hidden p-0 border border-gray-200 dark:border-[#30363d]">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50/50 dark:bg-[#0d1117]/50">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white' 
                    : 'bg-gradient-to-br from-[#16a34a] to-[#047857] text-white shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-[#3b82f6] text-white rounded-tr-none shadow-sm'
                      : 'bg-white dark:bg-[#161b22] text-[#111827] dark:text-[#e6edf3] rounded-tl-none border border-gray-100 dark:border-[#30363d] shadow-sm'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#16a34a] to-[#047857] text-white shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-[#30363d] shadow-sm p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-3 bg-white dark:bg-[#161b22] border-t border-gray-100 dark:border-[#30363d] overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#16a34a]/30 bg-[#ecfdf5] dark:bg-[#132c1e] text-[#16a34a] text-xs font-medium hover:bg-[#16a34a] hover:text-white dark:hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#161b22] border-t border-gray-100 dark:border-[#30363d]">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Ask me anything about your farm..."
              className="w-full bg-gray-50 dark:bg-[#0d1117] text-[#111827] dark:text-[#e6edf3] border border-gray-200 dark:border-[#30363d] rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} className={isTyping ? 'opacity-0' : ''} />
              {isTyping && <Loader2 size={16} className="absolute animate-spin" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
