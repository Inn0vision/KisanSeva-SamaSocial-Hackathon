import { useState } from 'react'
import { Landmark, ArrowRight, X, ExternalLink, Search, MapPin, Loader2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from 'react-i18next'
import schemesData from '../data/schemes.json'
import EmptyState from '../components/shared/EmptyState'
import axios from 'axios'

export default function Schemes() {
  const { profile } = useAuthStore()
  const { t, i18n } = useTranslation()
  const [selectedScheme, setSelectedScheme] = useState<any>(null)
  
  // AI Search States
  const [city, setCity] = useState(profile?.city || '')
  const [state, setState] = useState(profile?.state || 'Maharashtra')
  const [isSearching, setIsSearching] = useState(false)
  const [aiSchemes, setAiSchemes] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const userState = profile?.state || 'All'
  const eligibleSchemes = schemesData.filter(scheme => 
    scheme.states.includes('All') || 
    scheme.states.some(s => s.toLowerCase() === userState.toLowerCase())
  )

  const searchLocalSchemes = async () => {
    if (!city || !state) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await axios.post('/api/schemes/search', {
        city,
        state,
        language: i18n.language
      });
      if (res.data.success) {
        setAiSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center text-white shadow-[0_0_20px_rgba(63,185,80,0.3)]">
          <Landmark size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-[#e6edf3]">
            {t('schemes.title') || "Government Schemes"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('Discover national and state-level financial assistance programs.')}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: AI Local Search */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="card-base border-t-4 border-t-emerald-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <Sparkles size={100} className="text-emerald-500" />
            </div>
            
            <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-2 flex items-center gap-2 relative z-10">
               {t('KisanSeva AI Match')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10">
               {t('Find highly specific schemes available in your exact district and state.')}
            </p>

            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
                  {t('State')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg py-2.5 pl-10 pr-4 text-[#111827] dark:text-[#e6edf3] focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="E.g., Maharashtra"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
                  {t('City / District')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg py-2.5 pl-10 pr-4 text-[#111827] dark:text-[#e6edf3] focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="E.g., Pune"
                  />
                </div>
              </div>

              <button 
                onClick={searchLocalSchemes}
                disabled={!city || !state || isSearching}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span>{isSearching ? "Searching..." : "Find Local Schemes"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Fallback */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {hasSearched ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-500" /> 
                Recommended Schemes for {city}, {state}
              </h3>
              
              {isSearching ? (
                <div className="card-base flex flex-col items-center justify-center py-16">
                   <Loader2 size={40} className="text-emerald-500 animate-spin mb-4" />
                   <p className="text-slate-500 dark:text-slate-400">{t('KisanSeva AI is curating government schemes for you...')}</p>
                </div>
              ) : aiSchemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiSchemes.map((scheme, i) => (
                    <motion.div 
                      key={`ai-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card-base cursor-pointer border-emerald-500/30 hover:border-emerald-500 transition-all group flex flex-col"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      <h3 className="font-semibold text-lg text-[#111827] dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                        {scheme.title}
                      </h3>
                      <p className="text-sm text-[#4b5563] dark:text-slate-400 line-clamp-3 mb-4">
                        {scheme.description}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">
                          {scheme.subsidy}
                        </span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="card-base text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">{t('No specific local schemes found. Try a different city.')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">
                {t('Popular National & State Schemes')}
              </h3>
              {eligibleSchemes.length === 0 ? (
                <div className="card-base min-h-[300px] flex items-center justify-center">
                  <EmptyState 
                    icon={Landmark}
                    title={t('schemes.noSchemes')}
                    description="Update your profile state to find schemes."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eligibleSchemes.map((scheme, i) => (
                    <motion.div 
                      key={scheme.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card-base cursor-pointer hover:border-[#16a34a] transition-all group flex flex-col"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      <h3 className="font-semibold text-lg text-[#111827] dark:text-[#e6edf3] mb-2 group-hover:text-[#16a34a] transition-colors">
                        {scheme.title}
                      </h3>
                      <p className="text-sm text-[#4b5563] dark:text-[#8b949e] line-clamp-2 mb-4">
                        {scheme.description}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs font-semibold text-[#16a34a] dark:text-[#3fb950] bg-[#ecfdf5] dark:bg-[#132c1e] px-2 py-1 rounded line-clamp-1 max-w-[80%]">
                          {t('schemes.subsidy') || 'Subsidy:'} {scheme.subsidy}
                        </span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-[#16a34a] transition-colors flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Scheme Details */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-[#161b22] rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-6 relative">
                <button 
                  onClick={() => setSelectedScheme(null)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-[#21262d] transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Landmark className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedScheme.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {selectedScheme.description}
                </p>

                <div className="bg-gray-50 dark:bg-[#0d1117] rounded-lg p-4 mb-6 border border-gray-200 dark:border-[#30363d]">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">
                    {t('Benefits / Subsidy')}
                  </h4>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedScheme.subsidy}
                  </p>
                </div>

                <div className="flex gap-3">
                  {selectedScheme.link && selectedScheme.link !== "Visit local agriculture office" ? (
                    <a 
                      href={selectedScheme.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <span>{t('schemes.applyNow') || 'Apply Now'}</span>
                      <ExternalLink size={18} />
                    </a>
                  ) : (
                    <div className="flex-1 text-center py-3 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium">
                      {t('Visit Local Agriculture Office')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
