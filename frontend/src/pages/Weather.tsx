import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Wind, Droplets, Sun, Loader2, Sprout } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from 'react-i18next'
import AlertBanner from '../components/shared/AlertBanner'

export default function Weather() {
  const { profile } = useAuthStore()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchAdvWeather = async () => {
      if (!profile?.city) return
      try {
        setLoading(true)
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(profile.city)}&count=1`)
        const geoData = await geoRes.json()
        
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0]
          
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=soil_moisture_3_to_9cm,evapotranspiration&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto&forecast_days=16`)
          const weatherData = await weatherRes.json()
          
          setData({
            current: {
              temp: Math.round(weatherData.current.temperature_2m),
              humidity: Math.round(weatherData.current.relative_humidity_2m),
              wind: Math.round(weatherData.current.wind_speed_10m),
            },
            agronomy: {
              soilMoisture: weatherData.hourly.soil_moisture_3_to_9cm[0] || 0.2, // fallback
              et0: weatherData.hourly.evapotranspiration[0] || 0.1
            },
            forecast: weatherData.daily.time.slice(0, 16).map((time: string, i: number) => ({
              date: i === 0 ? t('weather.today') : new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              max: Math.round(weatherData.daily.temperature_2m_max[i]),
              min: Math.round(weatherData.daily.temperature_2m_min[i]),
              precipProb: weatherData.daily.precipitation_probability_max[i]
            }))
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdvWeather()
  }, [profile?.city, t])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg gradient-green flex items-center justify-center text-white shadow-green-glow dark:shadow-[0_0_20px_rgba(63,185,80,0.20)]">
          <CloudRain size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">
          {t('weather.title')}
        </h1>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#16a34a]" size={32} />
        </div>
      ) : data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          
          <AlertBanner 
            type="info" 
            title={t('weather.sowingWindow')} 
            message={t('weather.sowingMsg', { moisture: (data.agronomy.soilMoisture * 100).toFixed(0) })} 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Temp */}
            <div className="card-base bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-none flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-medium text-blue-50">{profile?.city}</span>
                <Sun size={24} className="text-yellow-300" fill="currentColor" />
              </div>
              <div className="mt-6">
                <div className="text-5xl font-bold">{data.current.temp}°C</div>
                <div className="text-blue-100 mt-1 flex items-center gap-4 text-sm font-medium">
                  <span className="flex items-center gap-1"><Droplets size={14} /> {data.current.humidity}%</span>
                  <span className="flex items-center gap-1"><Wind size={14} /> {data.current.wind} km/h</span>
                </div>
              </div>
            </div>

            {/* Agronomy Metrics */}
            <div className="md:col-span-2 card-base">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sprout size={18} className="text-[#16a34a]" />
                {t('weather.agronomicMetrics')}
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('weather.soilMoisture')}</div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">
                      {(data.agronomy.soilMoisture * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm text-[#16a34a] font-medium mb-1">{t('weather.optimal')}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#30363d] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#16a34a] h-full" style={{ width: `${Math.min(data.agronomy.soilMoisture * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('weather.evapotranspiration')}</div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-[#111827] dark:text-[#e6edf3]">
                      {data.agronomy.et0.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 mb-1">mm/hr</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#30363d] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-orange-400 h-full" style={{ width: `${Math.min((data.agronomy.et0 / 0.5) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="card-base">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('weather.forecast')}
            </h3>
            <div className="space-y-3">
              {data.forecast.map((day: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1c2128] transition-colors border border-transparent hover:border-gray-100 dark:hover:border-[#30363d]">
                  <span className="w-20 font-medium text-gray-900 dark:text-gray-200">{day.date}</span>
                  <div className="flex items-center gap-1 text-sm font-medium text-blue-500 w-24">
                    <CloudRain size={14} />
                    {day.precipProb}%
                  </div>
                  <div className="w-32 flex items-center justify-end gap-2">
                    <span className="text-gray-500 dark:text-gray-400">{day.min}°</span>
                    <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-orange-400"></div>
                    <span className="font-semibold text-gray-900 dark:text-white">{day.max}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}
