import { useLanguageStore } from '../../store/language'
import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore()
  const { i18n } = useTranslation()

  const options = [
    { code: 'en', label: 'EN' },
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
  ] as const

  const handleLanguageChange = (code: any) => {
    setLanguage(code)
    i18n.changeLanguage(code)
  }

  return (
    <div className="inline-flex p-[3px] rounded-[10px] bg-[#f3f4f6] dark:bg-[#21262d]">
      {options.map((opt) => {
        const isActive = language === opt.code
        return (
          <button
            key={opt.code}
            onClick={() => handleLanguageChange(opt.code)}
            className={`
              px-3.5 py-1.5 rounded-lg text-[13px] transition-all duration-150 border-none cursor-pointer
              ${isActive 
                ? 'bg-white dark:bg-[#2d333b] text-[#15803d] dark:text-[#3fb950] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.10)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.40)]' 
                : 'bg-transparent text-[#6b7280] dark:text-[#8b949e] font-medium hover:text-[#374151] dark:hover:text-[#c9d1d9]'
              }
            `}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
