import { motion, AnimatePresence } from 'framer-motion'
import { X, TriangleAlert, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface AlertBannerProps {
  type: 'warning' | 'danger' | 'info' | 'success'
  title: string
  message: string
}

const variants = {
  warning: {
    bg: 'bg-[#fffbeb] dark:bg-[#1f1a08]',
    border: 'border-[#fcd34d] dark:border-[#854d0e]',
    icon: <TriangleAlert className="text-[#f59e0b] dark:text-[#d29922]" size={20} />,
    title: 'text-[#92400e] dark:text-[#fed7aa]'
  },
  danger: {
    bg: 'bg-[#fef2f2] dark:bg-[#1f0d0d]',
    border: 'border-[#fecaca] dark:border-[#7f1d1d]',
    icon: <AlertCircle className="text-[#dc2626] dark:text-[#f85149]" size={20} />,
    title: 'text-[#991b1b] dark:text-[#fca5a5]'
  },
  info: {
    bg: 'bg-[#eff6ff] dark:bg-[#0d1f3c]',
    border: 'border-[#bfdbfe] dark:border-[#1e3a5f]',
    icon: <Info className="text-[#3b82f6] dark:text-[#58a6ff]" size={20} />,
    title: 'text-[#1e40af] dark:text-[#93c5fd]'
  },
  success: {
    bg: 'bg-[#f0fdf4] dark:bg-[#0d2818]',
    border: 'border-[#86efac] dark:border-[#14532d]',
    icon: <CheckCircle className="text-[#16a34a] dark:text-[#3fb950]" size={20} />,
    title: 'text-[#166534] dark:text-[#86efac]'
  }
}

export default function AlertBanner({ type, title, message }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const style = variants[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -24, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto', transition: { duration: 0.4, ease: "easeOut" } }}
          exit={{ opacity: 0, y: -12, height: 0, transition: { duration: 0.25 } }}
          className="overflow-hidden mb-6"
        >
          <div className={`${style.bg} border ${style.border} rounded-xl p-4 flex gap-3 relative`}>
            <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
            <div className="pr-8">
              {/* Note: The UI screenshot shows title and message inline */}
              <p className="text-sm">
                <span className={`font-semibold ${style.title} mr-2`}>{title}</span>
                <span className="text-[#4b5563] dark:text-[#d1d5db]">{message}</span>
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 btn-icon !w-8 !h-8 !text-current opacity-70 hover:opacity-100"
              aria-label="Dismiss alert"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
