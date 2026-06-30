import { useState } from 'react'
import { Landmark, ArrowRight, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from 'react-i18next'
import schemesData from '../data/schemes.json'
import EmptyState from '../components/shared/EmptyState'

export default function Schemes() {
  const { profile } = useAuthStore()
  const { t } = useTranslation()
  const [selectedScheme, setSelectedScheme] = useState<any>(null)

  const userState = profile?.state || 'All'
  
  const eligibleSchemes = schemesData.filter(scheme => 
    scheme.states.includes('All') || 
    scheme.states.some(s => s.toLowerCase() === userState.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center text-white shadow-green-glow dark:shadow-[0_0_20px_rgba(63,185,80,0.20)]">
          <Landmark size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">
          {t('schemes.title')}
        </h1>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {t('schemes.availableSchemes', { state: userState })}
      </p>

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
              className="card-base cursor-pointer hover:border-[#16a34a] transition-all group"
              onClick={() => setSelectedScheme(scheme)}
            >
              <h3 className="font-semibold text-lg text-[#111827] dark:text-[#e6edf3] mb-2 group-hover:text-[#16a34a] transition-colors">
                {scheme.title}
              </h3>
              <p className="text-sm text-[#4b5563] dark:text-[#8b949e] line-clamp-2 mb-4">
                {scheme.description}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs font-semibold text-[#16a34a] dark:text-[#3fb950] bg-[#ecfdf5] dark:bg-[#132c1e] px-2 py-1 rounded">
                  {t('schemes.subsidy')} {scheme.subsidy}
                </span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-[#16a34a] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-[#21262d]"
                >
                  <X size={20} />
                </button>

                <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] dark:bg-[#132c1e] flex items-center justify-center mb-4">
                  <Landmark className="text-[#16a34a] dark:text-[#3fb950]" size={24} />
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedScheme.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {selectedScheme.description}
                </p>

                <div className="bg-gray-50 dark:bg-[#0d1117] rounded-lg p-4 mb-6 border border-gray-200 dark:border-[#30363d]">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">
                    Benefits / Subsidy
                  </h4>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedScheme.subsidy}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a 
                    href={selectedScheme.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <span>{t('schemes.applyNow')}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
