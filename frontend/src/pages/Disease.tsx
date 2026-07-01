import { useState, useEffect, useRef } from 'react'
import { Microscope, Upload, Search, Loader2, Send, Bot, User, Trash2, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useScanStore } from '../store/scanStore'

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string | string[];
}

export default function Disease() {
  const { t, i18n } = useTranslation();
  

  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { scans, addScan } = useScanStore();

  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending]);

  // Cleanup session on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        closeSession(sessionId);
      }
    };
  }, [sessionId]);

  const closeSession = async (id: string) => {
    try {
      await fetch('/api/disease/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: id })
      });
    } catch (e) {
      console.error("Failed to close session", e);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (sessionId) {
      await closeSession(sessionId);
      setSessionId(null);
    }

    setPreview(URL.createObjectURL(selectedFile));
    setIsAnalyzing(true);
    setChatMessages([]);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("language", i18n.language);

    try {
      const response = await fetch("/api/disease/analyze", {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSessionId(result.session_id);
        let overview = "";
        if (result.ai_overview && result.ai_overview.length > 0) {
           overview = Array.isArray(result.ai_overview) ? result.ai_overview.join(" ") : result.ai_overview;
           setChatMessages([{
             id: 'initial',
             role: 'assistant',
             content: result.ai_overview
           }]);
        } else {
           overview = "Analysis complete. Ask me any questions about this crop!";
           setChatMessages([{
             id: 'initial',
             role: 'assistant',
             content: [overview]
           }]);
        }
        
        const summaryText = overview.substring(0, 60) + (overview.length > 60 ? "..." : "");
        addScan({ summary: summaryText });
      } else {
        alert(result.detail || "Analysis failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Make sure backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !sessionId || isSending) return;

    const question = currentInput.trim();
    setCurrentInput('');
    
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: question
    };
    
    setChatMessages(prev => [...prev, newUserMsg]);
    setIsSending(true);

    try {
      const response = await fetch("/api/disease/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, question, language: i18n.language })
      });
      
      const result = await response.json();
      if (result.success) {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: result.response
        }]);
      } else {
        alert(result.detail || "Chat failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error communicating with AI.");
    } finally {
      setIsSending(false);
    }
  };

  const resetAnalysis = () => {
    if (sessionId) {
      closeSession(sessionId);
    }
    setSessionId(null);
    setPreview(null);
    setChatMessages([]);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center text-white shadow-green-glow dark:shadow-[0_0_20px_rgba(63,185,80,0.20)]">
          <Microscope size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">{t('disease.title')}</h1>
          <p className="text-sm text-[#4b5563] dark:text-[#8b949e]">{t('disease.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Upload / Image Preview */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          {!preview ? (
            <label className="card-base border-2 border-dashed border-[#16a34a]/30 hover:border-[#16a34a] transition-colors relative overflow-hidden group cursor-pointer flex flex-col items-center justify-center h-64">
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <div className="w-16 h-16 rounded-full bg-[#ecfdf5] dark:bg-[#132c1e] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload size={28} className="text-[#16a34a]" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#e6edf3] mb-1">{t('disease.upload')}</h3>
              <p className="text-sm text-[#4b5563] dark:text-[#8b949e] max-w-sm text-center px-4">
                {t('disease.dragDrop')}
              </p>
            </label>
          ) : (
            <div className="card-base p-0 overflow-hidden relative">
              <img src={preview} alt="Crop preview" className="w-full h-auto max-h-[400px] object-cover" />
              <button onClick={resetAnalysis} className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {/* Recent Scans List */}
          <div className="card-base mt-2">
            <div className="flex items-center gap-2 font-bold text-[#111827] dark:text-[#e6edf3] mb-4">
              <Clock size={18} className="text-[#16a34a]" />
              {t('Recent Scans')}
            </div>
            
            {scans.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t('No recent scans')}</p>
            ) : (
              <div className="space-y-3">
                {scans.map((scan) => (
                  <div key={scan.id} className="flex flex-col gap-1 p-3 rounded-lg bg-gray-50 dark:bg-[#161b22] border border-gray-100 dark:border-[#30363d]">
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(scan.date).toLocaleDateString()}
                    </span>
                    <p className="text-sm text-[#111827] dark:text-[#e6edf3] line-clamp-2">
                      {scan.summary.replace(/[*#]/g, '')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results & Chat */}
        <div className="lg:w-2/3 flex flex-col">
          {isAnalyzing ? (
            <div className="card-base flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 size={48} className="text-[#16a34a] animate-spin mb-4" />
              <h3 className="text-xl font-bold text-[#111827] dark:text-[#e6edf3] mb-2">{t('disease.analyzing')}</h3>
              <p className="text-sm text-[#4b5563] dark:text-[#8b949e]">{t('This might take up to a minute. Extracting AI overview...')}</p>
            </div>
          ) : !sessionId ? (
            <div className="card-base flex-1 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-gray-200 dark:border-[#30363d] bg-transparent">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#161b22] flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#e6edf3] mb-2">{t('disease.noReportMsg')}</h3>
            </div>
          ) : (
            <div className="card-base flex-1 flex flex-col p-0 overflow-hidden h-[600px]">
              {/* Chat History Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0d1117]">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#16a34a] text-white' : 'bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] text-[#16a34a]'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#16a34a] text-white' : 'bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] text-[#111827] dark:text-[#e6edf3]'}`}>
                        {Array.isArray(msg.content) ? (
                          <div className="space-y-2">
                            {msg.content.map((block, i) => (
                              <p key={i} className={block.startsWith('•') ? 'ml-4' : ''}>{block}</p>
                            ))}
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] text-[#16a34a] flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-[#16a34a]" />
                        <span className="text-sm text-[#4b5563] dark:text-[#8b949e]">{t('chat.thinking')}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-[#161b22] border-t border-gray-200 dark:border-[#30363d]">
                <form onSubmit={handleSendMessage} className="relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    disabled={isSending}
                    className="w-full bg-gray-100 dark:bg-[#0d1117] border-0 text-[#111827] dark:text-[#e6edf3] text-sm rounded-xl py-3.5 pl-4 pr-12 focus:ring-2 focus:ring-[#16a34a]"
                  />
                  <button 
                    type="submit" 
                    disabled={!currentInput.trim() || isSending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 disabled:hover:bg-[#16a34a] text-white rounded-lg transition-colors"
                  >
                    <Send size={16} className={currentInput.trim() && !isSending ? "ml-0.5" : ""} />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
