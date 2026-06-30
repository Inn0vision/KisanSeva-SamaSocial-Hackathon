import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: string | React.ReactNode
  subtitle: string
  icon: LucideIcon
  valueColor?: string
  badge?: React.ReactNode
}

export const cardItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function MetricCard({ title, value, subtitle, icon: Icon, valueColor, badge }: MetricCardProps) {
  return (
    <motion.div variants={cardItem} className="card-base flex flex-col justify-between cursor-default">
      <div className="flex items-center gap-1.5 text-[0.8125rem] text-[#9ca3af] dark:text-[#8b949e] font-medium mb-3">
        <Icon size={14} strokeWidth={2} />
        <span>{title}</span>
      </div>
      
      <div className="mb-2 relative">
        <div className={`text-[2rem] font-bold leading-none tracking-tight ${valueColor || 'text-[#111827] dark:text-[#e6edf3]'}`}>
          {value}
        </div>
        {badge && (
          <div className="absolute -top-1 -right-1">
            {badge}
          </div>
        )}
      </div>
      
      <div className="text-[0.8125rem] text-[#4b5563] dark:text-[#8b949e] leading-snug max-w-[85%] whitespace-pre-line">
        {subtitle}
      </div>
    </motion.div>
  )
}
