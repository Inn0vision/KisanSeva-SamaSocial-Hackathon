import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Map, Leaf, FlaskConical, Sprout, Activity, RefreshCw, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function Land() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    crop: 'Wheat',
    soil_type: 'Loam',
    ph: 6.5,
    nitrogen: 'Medium',
    phosphorus: 'Medium',
    potassium: 'Medium'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{score: number, report: string} | null>(null);
  
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post('http://localhost:8000/api/land/analyze', formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze soil. Is backend running?");
    }
    setIsAnalyzing(false);
  };
  
  const resetForm = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-full mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <FlaskConical size={36} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          AI Soil Health Analysis
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Input your known soil attributes and let our Gemini AI engine diagnose your land's health, predicting vulnerabilities and generating a custom fertilization plan.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isAnalyzing && !result && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="card-base p-8 md:p-12 max-w-4xl mx-auto border-t-4 border-t-emerald-500 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative z-10">
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Target Crop</label>
                  <input 
                    type="text" 
                    value={formData.crop}
                    onChange={e => setFormData({...formData, crop: e.target.value})}
                    className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    placeholder="e.g., Wheat, Soybean, Cotton"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Soil Type</label>
                  <select 
                    value={formData.soil_type}
                    onChange={e => setFormData({...formData, soil_type: e.target.value})}
                    className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option value="Sandy">Sandy</option>
                    <option value="Clay">Clay</option>
                    <option value="Silt">Silt</option>
                    <option value="Loam">Loam</option>
                    <option value="Peaty">Peaty</option>
                    <option value="Saline">Saline</option>
                  </select>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800/50">
                  <label className="block text-sm font-semibold text-slate-300 mb-4 flex justify-between uppercase tracking-wider">
                    <span>pH Level</span>
                    <span className="text-emerald-400 font-bold text-lg">{formData.ph}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" max="14" step="0.1"
                    value={formData.ph}
                    onChange={e => setFormData({...formData, ph: parseFloat(e.target.value)})}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs font-medium text-slate-500 mt-3 uppercase">
                    <span>0 (Acidic)</span>
                    <span>7 (Neutral)</span>
                    <span>14 (Alkaline)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800/50 space-y-6">
                  <h3 className="text-sm font-semibold text-emerald-500 mb-2 uppercase tracking-wider">Macronutrients (NPK)</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nitrogen (N)</label>
                    <select 
                      value={formData.nitrogen}
                      onChange={e => setFormData({...formData, nitrogen: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="Low">Low (Depleted)</option>
                      <option value="Medium">Medium (Optimal)</option>
                      <option value="High">High (Excessive)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phosphorus (P)</label>
                    <select 
                      value={formData.phosphorus}
                      onChange={e => setFormData({...formData, phosphorus: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="Low">Low (Depleted)</option>
                      <option value="Medium">Medium (Optimal)</option>
                      <option value="High">High (Excessive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Potassium (K)</label>
                    <select 
                      value={formData.potassium}
                      onChange={e => setFormData({...formData, potassium: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    >
                      <option value="Low">Low (Depleted)</option>
                      <option value="Medium">Medium (Optimal)</option>
                      <option value="High">High (Excessive)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              className="w-full mt-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl font-bold text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 hover:-translate-y-1 relative z-10 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Activity size={28} className="relative z-10" />
              <span className="relative z-10">Analyze Soil with Gemini AI</span>
            </button>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <div className="relative w-40 h-40 mb-10">
              <motion.div 
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl"
              />
              <div className="absolute inset-0 bg-slate-900 rounded-full border-4 border-emerald-500/50 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={50} className="text-emerald-400" />
                </motion.div>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Gemini AI is analyzing...</h2>
            <p className="text-emerald-400/80 animate-pulse text-lg">Running agronomic simulations and nutrient mapping</p>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="card-base p-1 border-t-4 border-t-emerald-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-3xl" />
              <div className="relative bg-slate-900/90 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                
                <div className="shrink-0 relative">
                  <svg className="w-48 h-48 drop-shadow-2xl" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="#1e293b" strokeWidth="8" 
                    />
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke={result.score > 70 ? "#10b981" : result.score > 40 ? "#f59e0b" : "#ef4444"} 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 283} 283`}
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: `${(result.score / 100) * 283} 283` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, type: "spring" }}
                      className="text-5xl font-black text-white drop-shadow-md"
                    >
                      {result.score}
                    </motion.span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Health Score</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Assessment Complete</h2>
                  <p className="text-slate-400 text-lg mb-8">
                    Based on your <span className="text-emerald-400 font-semibold">{formData.soil_type}</span> soil profile for growing <span className="text-emerald-400 font-semibold">{formData.crop}</span>.
                  </p>
                  <button 
                    onClick={resetForm}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all inline-flex items-center gap-3 font-semibold hover:-translate-y-1 shadow-lg border border-slate-700"
                  >
                    <RefreshCw size={18} /> Analyze Another Field
                  </button>
                </div>
              </div>
            </div>

            <div className="card-base p-8 md:p-12 relative overflow-hidden">
               {/* Custom markdown styling since we don't have typography plugin */}
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Leaf size={200} />
              </div>
              <div className="relative z-10 text-slate-300 leading-relaxed text-lg
                [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-6 [&>h1]:mt-8
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-emerald-400 [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-slate-800
                [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mb-3 [&>h3]:mt-6
                [&>p]:mb-6
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:space-y-2 [&>ul>li::marker]:text-emerald-500
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
                [&>strong]:text-white [&>strong]:font-semibold
                [&>blockquote]:border-l-4 [&>blockquote]:border-emerald-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-400
              ">
                <ReactMarkdown>{result.report}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
