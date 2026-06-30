import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplet, Leaf, Coins, Microscope, CloudRain, Landmark, CloudLightning, Cloud, Sun, Loader2, ArrowRight, Map, ShieldCheck } from 'lucide-react'
import AlertBanner from '../components/shared/AlertBanner'
import MetricCard from '../components/shared/MetricCard'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from 'react-i18next'
import schemesData from '../data/schemes.json'
import { Link } from 'react-router-dom'

import type { Variants } from 'framer-motion'

const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const getWeatherDetails = (code: number) => {
  if (code <= 1) return { icon: Sun, label: 'Clear', color: 'text-[#f59e0b]' };
  if (code <= 3) return { icon: Cloud, label: 'Cloudy', color: 'text-[#9ca3af]' };
  if (code <= 67) return { icon: CloudRain, label: 'Rain', color: 'text-[#3b82f6]' };
  if (code <= 99) return { icon: CloudLightning, label: 'Storm', color: 'text-[#f59e0b]' };
  return { icon: Cloud, label: 'Unknown', color: 'text-[#9ca3af]' };
}

export default function Dashboard() {
  const { profile } = useAuthStore()
  const { t } = useTranslation()
  
  const [weather, setWeather] = useState<{
    currentTemp: number | null,
    humidity: number | null,
    forecast: Array<{ date: string, max: number, min: number, code: number }>
  }>({ currentTemp: null, humidity: null, forecast: [] })
  const [loadingWeather, setLoadingWeather] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      if (!profile?.city) return;
      try {
        setLoadingWeather(true);
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(profile.city)}&count=1`);
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`);
          const weatherData = await weatherRes.json();
          
          const forecast = weatherData.daily.time.slice(0, 5).map((time: string, index: number) => ({
            date: index === 0 ? t('weather.today') : new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
            max: Math.round(weatherData.daily.temperature_2m_max[index]),
            min: Math.round(weatherData.daily.temperature_2m_min[index]),
            code: weatherData.daily.weather_code[index]
          }));

          setWeather({
            currentTemp: Math.round(weatherData.current.temperature_2m),
            humidity: Math.round(weatherData.current.relative_humidity_2m),
            forecast
          });
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [profile?.city, t]);

  const userState = profile?.state || 'All'
  const topSchemes = schemesData
    .filter(scheme => scheme.states.includes('All') || scheme.states.some(s => s.toLowerCase() === userState.toLowerCase()))
    .slice(0, 2);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { key: 'dashboard.greetingMorning', icon: '🌤️' };
    if (hour < 17) return { key: 'dashboard.greetingAfternoon', icon: '☀️' };
    return { key: 'dashboard.greetingEvening', icon: '🌙' };
  };
  const { key: greetingKey, icon: greetingIcon } = getGreeting();


  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16a34a]/10 to-transparent dark:from-[#238636]/10 border border-[#16a34a]/20 dark:border-[#238636]/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] dark:text-[#e6edf3] mb-2 flex items-center gap-2">
              {t(greetingKey)}, {profile?.name?.split(' ')[0] || t('dashboard.farmer')} {greetingIcon}
            </h1>
            <div className="flex items-center gap-3 text-sm font-medium text-[#4b5563] dark:text-[#8b949e]">
              {profile?.mainCrop && (
                <span className="flex items-center gap-1.5 bg-white dark:bg-[#161b22] px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-[#30363d]">
                  <Leaf size={14} className="text-[#16a34a]" /> {profile.mainCrop} {t('dashboard.farmer')}
                </span>
              )}
              {profile?.city && (
                <span className="flex items-center gap-1.5 bg-white dark:bg-[#161b22] px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-[#30363d]">
                  <Map size={14} className="text-[#3b82f6]" /> {profile.city}, {profile.state}
                </span>
              )}
            </div>
          </div>
          
          {profile?.name && (
            <div className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-[#16a34a] to-[#047857] shadow-lg items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-[#0d1117]">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#16a34a]/10 dark:bg-[#238636]/10 rounded-full blur-3xl pointer-events-none" />
      </div>



      <AlertBanner 
        type="warning" 
        title={t('dashboard.weatherAdvisory')} 
        message={t('dashboard.weatherAdvisoryMsg', { city: profile?.city || 'your area' })} 
      />

      <motion.div 
        variants={staggerContainer} 
        initial="initial" 
        animate="animate" 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
      >
        <MetricCard
          title={t('dashboard.temperature')}
          value={weather.currentTemp !== null ? `${weather.currentTemp}°C` : '--°C'}
          subtitle={t('dashboard.current')}
          icon={Thermometer}
          valueColor="text-[#f59e0b] dark:text-[#d29922]"
        />
        <MetricCard
          title={t('dashboard.humidity')}
          value={weather.humidity !== null ? `${weather.humidity}%` : '--%'}
          subtitle={t('dashboard.current')}
          icon={Droplet}
          valueColor="text-[#3b82f6] dark:text-[#60a5fa]"
        />
        <MetricCard
          title={t('dashboard.cropHealth')}
          value={<span><span className="text-[#22c55e] dark:text-[#3fb950]">82</span>/100</span>}
          subtitle="Soybean · field A"
          icon={Leaf}
        />
        <MetricCard
          title={t('dashboard.eligibleSchemes')}
          value={`${topSchemes.length} ${t('common.viewAll')}`}
          subtitle={t('common.viewAll')}
          icon={Coins}
        />
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Farm Health Score */}
        <motion.div variants={fadeInUp} className="card-base flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-semibold text-[#111827] dark:text-[#e6edf3] mb-4">{t('dashboard.farmHealth')}</h3>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200 dark:stroke-[#30363d]" strokeWidth="3" />
              <motion.circle 
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: "87, 100" }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                cx="18" cy="18" r="16" fill="none" className="stroke-[#16a34a] dark:stroke-[#3fb950]" strokeWidth="3" strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#111827] dark:text-[#e6edf3]">87<span className="text-sm">%</span></span>
              <span className="text-xs font-medium text-[#16a34a] flex items-center mt-1">↑ 4%</span>
            </div>
          </div>
          <p className="text-xs text-[#4b5563] dark:text-[#8b949e] mt-4">{t('dashboard.basedOn')}</p>
        </motion.div>

        {/* Farm Risk Indicator */}
        <motion.div variants={fadeInUp} className="card-base flex flex-col justify-between items-center text-center">
          <h3 className="text-sm font-semibold text-[#111827] dark:text-[#e6edf3] mb-4 w-full text-left">{t('dashboard.farmRisk')}</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 relative">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-emerald-200/50 dark:bg-emerald-900/20"
              />
              <ShieldCheck size={36} className="text-[#16a34a] dark:text-[#3fb950] relative z-10" />
            </div>
            <span className="text-xl font-bold text-[#16a34a] dark:text-[#3fb950]">{t('dashboard.lowRisk')}</span>
            <p className="text-sm text-[#4b5563] dark:text-[#8b949e] mt-2">{t('dashboard.favorableConditions')}</p>
          </div>
        </motion.div>

        {/* Top govt schemes */}
        <motion.div variants={fadeInUp} className="card-base flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-semibold text-[#111827] dark:text-[#e6edf3]">
                <Landmark size={20} className="text-[#f59e0b]" />
                {t('dashboard.topSchemes')}
              </div>
              <Link to="/schemes" className="text-sm font-medium text-[#16a34a] flex items-center hover:underline">
                {t('common.viewAll')} <ArrowRight size={16} className="ml-1"/>
              </Link>
            </div>
            
            <div className="space-y-4">
              {topSchemes.map(scheme => (
                <div key={scheme.id} className="group flex justify-between items-center p-3 rounded-xl border border-gray-100 dark:border-[#30363d] hover:border-[#16a34a]/30 dark:hover:border-[#3fb950]/30 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-sm text-[#111827] dark:text-[#e6edf3] group-hover:text-[#16a34a] transition-colors">{scheme.title}</h3>
                    <p className="text-xs text-[#4b5563] dark:text-[#8b949e] mt-1 font-medium">{t('dashboard.recommendedFor', { crop: profile?.mainCrop || 'you' })}</p>
                  </div>
                  <div className="text-[#16a34a] dark:text-[#3fb950] font-bold text-sm whitespace-nowrap ml-4 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">
                    {scheme.subsidy.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Crop Disease Scan & History */}
        <motion.div variants={fadeInUp} className="card-base flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-lg text-[#111827] dark:text-[#e6edf3]">
                <Microscope size={22} className="text-[#16a34a]" />
                {t('dashboard.diseaseScan')}
              </div>
            </div>
            
            {/* Recent Scans History - Empty State */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Scans</h4>
              
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center rounded-lg border border-dashed border-gray-200 dark:border-[#30363d] bg-gray-50/50 dark:bg-[#161b22]/50">
                 <Microscope size={24} className="text-gray-400 mb-2 opacity-50" />
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No recent scans</p>
                 <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Scan a leaf to detect diseases early</p>
              </div>
            </div>
          </div>
          
          <Link to="/disease" className="relative z-10 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#047857] hover:from-[#15803d] hover:to-[#065f46] text-white font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
            {/* Animated scanning line inside button */}
            <motion.div 
              animate={{ x: ['-200%', '300%'] }} 
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute top-0 bottom-0 w-12 bg-white/20 skew-x-12"
            />
            <Microscope size={20} className="relative z-10" />
            <span className="relative z-10">{t('dashboard.scanCTA')}</span>
          </Link>

          {/* Background decorative animated scanner */}
          <div className="absolute right-0 top-0 bottom-0 w-40 opacity-[0.03] dark:opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden">
             <Microscope size={140} className="text-[#16a34a]" />
             <motion.div 
               animate={{ y: ['-150px', '150px'] }} 
               transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
               className="absolute w-full h-0.5 bg-[#16a34a] shadow-[0_0_15px_#16a34a]"
             />
          </div>
        </motion.div>

        {/* 5-day Forecast */}
        <motion.div variants={fadeInUp} className="card-base">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 font-bold text-lg text-[#111827] dark:text-[#e6edf3]">
              <CloudRain size={22} className="text-[#3b82f6]" />
              {t('weather.forecast')} <span className="text-sm font-normal text-gray-400">· {profile?.city || 'Loading...'}</span>
            </div>
            <Link to="/weather" className="text-sm font-medium text-[#16a34a] flex items-center hover:underline">
              {t('common.details')} <ArrowRight size={16} className="ml-1"/>
            </Link>
          </div>
          
          {loadingWeather ? (
            <div className="flex-1 flex items-center justify-center min-h-[160px]">
              <Loader2 className="animate-spin text-[#3b82f6]" size={28} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {weather.forecast.map((item, i) => {
                const details = getWeatherDetails(item.code);
                const Icon = details.icon;
                return (
                  <div key={i} className="flex items-center text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#161b22] transition-colors">
                    <span className="w-14 font-medium text-[#4b5563] dark:text-[#8b949e]">{item.date}</span>
                    <Icon size={20} className={`${details.color} mr-4`} />
                    <span className="w-20 font-bold text-[#111827] dark:text-[#e6edf3]">
                      {item.max}° <span className="font-normal text-[#9ca3af] dark:text-[#8b949e]">/ {item.min}°</span>
                    </span>
                    <span className={`ml-auto px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-[#30363d] text-gray-700 dark:text-gray-300`}>
                      {details.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
