import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Droplet, MapPin, Search, Activity, Waves, ThermometerSun, Map, Navigation, ExternalLink, RefreshCw } from 'lucide-react';

export default function Water() {
  const { t } = useTranslation();
  const [city, setCity] = useState('Fetching location...');
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using a free reverse geocoding API
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
            const data = await response.json();
            const foundCity = data.address.city || data.address.town || data.address.state_district || "Unknown Location";
            setCity(foundCity);
          } catch (error) {
            setCity("Location Access Denied");
          }
          setIsLocating(false);
        },
        () => {
          setCity("Location Access Denied");
          setIsLocating(false);
        }
      );
    } else {
      setCity("Geolocation not supported");
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-cyan-900 text-white p-8 md:p-12 mb-12 shadow-2xl shadow-blue-900/20"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <Droplet size={400} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-sm font-semibold mb-6">
            <Activity size={16} /> {t('water.heroBadge', { defaultValue: 'Live Water Intelligence' })}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {t('water.title', { defaultValue: 'Water Scarcity & Irrigation Intelligence' })}
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-2xl">
            {t('water.subtitle', { defaultValue: 'Understand your local water table, discover precision irrigation techniques, and adapt to changing climate conditions with data-driven insights.' })}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Local Intelligence */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1 space-y-8"
        >
          {/* Location Card */}
          <motion.div variants={itemVariants} className="card-base p-6 border-t-4 border-t-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="text-blue-500" /> {t('water.localInsights', { defaultValue: 'Local Insights' })}
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('water.currentRegion', { defaultValue: 'Current Region' })}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {isLocating ? <RefreshCw className="animate-spin text-blue-500" size={18} /> : <Navigation className="text-blue-500" size={18} />}
                  {city}
                </span>
                <button 
                  onClick={detectLocation}
                  disabled={isLocating}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <RefreshCw size={16} className={isLocating ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('water.quickSearch', { defaultValue: 'Quick Local Search' })}</p>
              
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(`groundwater level report in ${city !== 'Fetching location...' && city !== 'Location Access Denied' ? city : 'my area'}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('water.groundwaterSearch', { defaultValue: 'Groundwater Levels' })}</span>
                <Search size={14} className="text-gray-400 group-hover:text-blue-500" />
              </a>

              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(`water testing laboratory near ${city !== 'Fetching location...' && city !== 'Location Access Denied' ? city : 'me'}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('water.testingLabsSearch', { defaultValue: 'Water Testing Labs' })}</span>
                <Search size={14} className="text-gray-400 group-hover:text-blue-500" />
              </a>
              
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(`drip irrigation suppliers and experts in ${city !== 'Fetching location...' && city !== 'Location Access Denied' ? city : 'my area'}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('water.irrigationSearch', { defaultValue: 'Irrigation Experts' })}</span>
                <Search size={14} className="text-gray-400 group-hover:text-blue-500" />
              </a>
            </div>
          </motion.div>

          {/* Alert Card */}
          <motion.div variants={itemVariants} className="card-base p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-900/30">
            <h3 className="text-amber-800 dark:text-amber-500 font-bold flex items-center gap-2 mb-2">
              <ThermometerSun size={20} /> {t('water.scarcityAlert', { defaultValue: 'Scarcity Alert' })}
            </h3>
            <p className="text-amber-700/80 dark:text-amber-600/80 text-sm leading-relaxed mb-4">
              {t('water.scarcityDesc', { defaultValue: 'Changing climate patterns require proactive water management. Traditional flood irrigation wastes up to 60% of water through evaporation and deep percolation.' })}
            </p>
            <a 
              href="https://www.google.com/search?q=climate+change+impact+on+agriculture+water"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-500 transition-colors"
            >
              {t('water.readReport', { defaultValue: 'Read Climate Reports' })} <ExternalLink size={14} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Educational Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 space-y-8"
        >
          {/* Concept 1 */}
          <motion.div variants={itemVariants} className="card-base p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
                <Droplet size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('water.concept1Title', { defaultValue: 'Micro-Irrigation Transition' })}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('water.concept1Desc', { defaultValue: 'Transitioning from traditional flood irrigation to drip or sprinkler systems can reduce water usage by up to 50% while simultaneously increasing crop yields. These systems deliver water directly to the root zone, significantly minimizing evaporation.' })}
                </p>
                <a 
                  href="https://www.google.com/search?q=how+to+transition+to+drip+irrigation+agriculture"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
                >
                  {t('water.learnMore', { defaultValue: 'Learn implementation steps' })} <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Concept 2 */}
          <motion.div variants={itemVariants} className="card-base p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl shrink-0">
                <Waves size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('water.concept2Title', { defaultValue: 'Farm Ponds & Rainwater Harvesting' })}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('water.concept2Desc', { defaultValue: 'Capturing rainwater during monsoons in lined farm ponds provides a critical lifeline during dry spells. When combined with groundwater recharge structures, it helps replenish the local water table, ensuring long-term sustainability.' })}
                </p>
                <a 
                  href="https://www.google.com/search?q=farm+pond+construction+rainwater+harvesting"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 transition-colors bg-cyan-50 dark:bg-cyan-900/20 px-4 py-2 rounded-lg"
                >
                  {t('water.learnMore', { defaultValue: 'Learn implementation steps' })} <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Concept 3 */}
          <motion.div variants={itemVariants} className="card-base p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
                <Map size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('water.concept3Title', { defaultValue: 'Soil Moisture Conservation' })}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {t('water.concept3Desc', { defaultValue: 'Water management isn\'t just about irrigation; it\'s about retention. Practices like mulching, planting cover crops, and maintaining healthy soil organic matter can dramatically increase the soil\'s water-holding capacity, creating a natural reservoir.' })}
                </p>
                <a 
                  href="https://www.google.com/search?q=soil+moisture+conservation+mulching+cover+crops"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg"
                >
                  {t('water.learnMore', { defaultValue: 'Learn implementation steps' })} <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}
