import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Leaf, LogOut } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from '../shared/LanguageToggle'
import { useAuthStore } from '../../store/authStore'

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, logout } = useAuthStore()
  
  // Basic route name formatting
  const getPageTitle = () => {
    const path = location.pathname.substring(1)
    if (!path) return 'Dashboard'
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center justify-between px-4 md:px-6 bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-sm border-b border-[#e5e7eb] dark:border-[#30363d]">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button className="lg:hidden btn-icon" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        
        {/* Mobile Logo / Desktop Breadcrumb */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md gradient-green flex items-center justify-center text-white">
            <Leaf size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[#111827] dark:text-[#e6edf3]">KisanSeva</span>
        </div>
        
        <h2 className="hidden lg:block text-lg font-semibold text-[#111827] dark:text-[#e6edf3]">
          {getPageTitle()}
        </h2>
      </div>

      {/* Center Section - Search (Optional for MVP, omitted per spec) */}
      <div className="hidden md:flex flex-1"></div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="hidden sm:block">
          <LanguageToggle />
        </div>
        <ThemeToggle />
        
        {/* User Avatar */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-[#e5e7eb] dark:border-[#30363d]">
          <div className="w-8 h-8 rounded-full bg-[#ecfdf5] dark:bg-[#132c1e] text-[#16a34a] dark:text-[#3fb950] flex items-center justify-center text-xs font-bold border border-[#a7f3d0] dark:border-[#166534]">
            {initial}
          </div>
          <span className="hidden sm:block text-sm font-medium text-[#111827] dark:text-[#e6edf3]">
            {profile?.name || 'Farmer'}
          </span>
          <button 
            onClick={handleLogout}
            className="ml-1 p-1.5 rounded-md text-[#9ca3af] hover:text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#2d1a1a] transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
