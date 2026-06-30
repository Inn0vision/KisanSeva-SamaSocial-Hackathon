import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { pageVariants } from '../../lib/constants'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      <div className="w-20 h-20 rounded-full bg-[#f5f5f0] dark:bg-[#1c2128] flex items-center justify-center mb-4">
        <Icon size={48} className="text-[#9ca3af] dark:text-[#484f58]" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold text-[#111827] dark:text-[#e6edf3] mb-2">{title}</h2>
      <p className="text-sm text-[#9ca3af] dark:text-[#8b949e] text-center max-w-[280px] leading-relaxed mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button className="btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
