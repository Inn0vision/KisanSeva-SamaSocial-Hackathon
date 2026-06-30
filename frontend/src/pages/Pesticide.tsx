import { useState, useRef, useEffect } from 'react'
import { FlaskConical, Send, User, Bot, Loader2, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import EmptyState from '../components/shared/EmptyState'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

export default function Pesticide() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMsg = input.trim()
    setInput('')
    
    // Optimistic UI update
    const newHistory: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newHistory)
    setIsLoading(true)

    try {
      // Map frontend history to backend expected format
      const historyToSend = messages.map(m => ({ role: m.role, content: m.content }))
      
      const response = await fetch('http://localhost:8000/api/okf/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: historyToSend
        })
      })

      if (!response.ok) {
        throw new Error('API response was not ok')
      }

      const data = await response.json()
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply,
        sources: data.sources 
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '*Sorry, I encountered an error connecting to the OKF Knowledge Base. Please try again later.*' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center text-white shadow-green-glow dark:shadow-[0_0_20px_rgba(63,185,80,0.20)]">
          <FlaskConical size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">Pesticide & Disease Guide</h1>
          <p className="text-sm text-[#4b5563] dark:text-[#8b949e]">Powered by Open Knowledge Format (OKF) Agricultural DB</p>
        </div>
      </div>
      
      <div className="card-base flex-1 flex flex-col overflow-hidden p-0 bg-gray-50/50 dark:bg-[#0d1117]/50">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <EmptyState 
              icon={FlaskConical}
              title="Ask the OKF Pesticide Expert"
              description="Describe your crop issue (e.g., 'White spots on tomato leaves') and get safe, database-backed pesticide or organic recommendations."
              actionLabel="Type a message below to start"
              onAction={() => {}}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-[#16a34a] border-[#15803d] text-white' 
                      : 'bg-white dark:bg-[#161b22] border-gray-200 dark:border-[#30363d] text-[#16a34a]'
                  }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-3.5 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-[#16a34a] text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-[#161b22] text-[#111827] dark:text-[#e6edf3] border border-gray-100 dark:border-[#30363d] shadow-sm rounded-tl-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-[#0d1117] prose-a:text-[#16a34a] max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {/* Sources (if AI and has sources) */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.sources.map((source, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#30363d] px-2 py-1 rounded-md border border-gray-200 dark:border-[#4b5563]">
                            <BookOpen size={12} className="text-[#16a34a]" />
                            {source.replace('.md', '')}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm border bg-white dark:bg-[#161b22] border-gray-200 dark:border-[#30363d] text-[#16a34a]">
                  <Bot size={20} />
                </div>
                <div className="bg-white dark:bg-[#161b22] border border-gray-100 dark:border-[#30363d] shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 flex flex-col gap-2">
                   <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                     <Loader2 size={16} className="animate-spin text-[#16a34a]" />
                     Querying OKF database...
                   </div>
                   <div className="flex gap-1">
                     <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-[#161b22] border-t border-[#e5e7eb] dark:border-[#30363d]">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              className="input-base shadow-inner flex-1 bg-gray-50 dark:bg-[#0d1117]" 
              placeholder="E.g., What is the best treatment for late blight on tomatoes?" 
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-primary flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
