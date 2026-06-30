import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Microscope, 
  Bot, 
  Map, 
  CloudRain, 
  Droplet, 
  Landmark, 
  Recycle, 
  Users,
  X,
  Leaf
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from '../shared/LanguageToggle'
import { useTranslation } from 'react-i18next'

const sidebarVariants = {
  closed: { x: '-100%', transition: { duration: 0.25 } },
  open: { x: 0, transition: { duration: 0.25 } },
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

type NavItem = {
  nameKey: string;
  path: string;
  icon: any;
  alert?: boolean;
  count?: number;
}

type NavGroup = {
  labelKey: string;
  items: NavItem[];
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()
  
  const navGroups: NavGroup[] = [
    {
      labelKey: 'nav.OVERVIEW',
      items: [
        { nameKey: 'nav.Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      labelKey: 'nav.CROP INTELLIGENCE',
      items: [
        { nameKey: 'nav.Disease detection', path: '/disease', icon: Microscope, alert: true },
        { nameKey: 'nav.Farmer AI', path: '/pesticide', icon: Bot },
        { nameKey: 'nav.Land analysis', path: '/land', icon: Map }
      ]
    },
    {
      labelKey: 'nav.CLIMATE',
      items: [
        { nameKey: 'nav.Weather & alerts', path: '/weather', icon: CloudRain, count: 1 },
        { nameKey: 'nav.Water scarcity', path: '/water', icon: Droplet }
      ]
    },
    {
      labelKey: 'nav.COMMUNITY',
      items: [
        { nameKey: 'nav.Govt schemes', path: '/schemes', icon: Landmark },
        { nameKey: 'nav.Waste & recycle', path: '/waste', icon: Recycle },
        { nameKey: 'nav.Farmer stories', path: '/stories', icon: Users }
      ]
    }
  ]

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0d1117] border-r border-[#e5e7eb] dark:border-[#30363d] shadow-modal dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-white">
            <Leaf size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#111827] dark:text-[#e6edf3] leading-none mb-1 tracking-tight">KisanSeva</h1>
            <p className="text-[0.65rem] text-[#9ca3af] dark:text-[#8b949e] font-medium leading-none tracking-wider">धरती · CLIMATE AI</p>
          </div>
        </div>
        <button className="lg:hidden btn-icon" onClick={onClose} aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            <div className="px-3 py-2 text-[0.65rem] font-bold tracking-[0.1em] text-[#9ca3af] dark:text-[#484f58] uppercase">
              {t(group.labelKey)}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path)
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose()
                    }}
                    className={({ isActive }) => 
                      `nav-item ${isActive ? 'nav-item-active' : ''}`
                    }
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2 : 1.75} />
                    <span>{t(item.nameKey)}</span>
                    {item.alert && <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] ml-auto animate-pulse" />}
                    {item.count && (
                      <span className="ml-auto min-w-[20px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#16a34a] dark:bg-[#238636] text-white">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-[#f3f4f6] dark:border-[#21262d]">
        <div className="flex items-center justify-between mb-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="text-[10px] text-[#9ca3af] dark:text-[#484f58] font-medium tracking-wider">
          v1.0.0 · KisanSeva
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 w-60 h-screen z-40">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed left-0 top-0 w-[260px] h-screen z-50 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            {SidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
