import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Leaf, Cpu, Droplets, Target, ExternalLink } from 'lucide-react'

const stories = [
  {
    id: 1,
    title: "NatureFresh Farms: AI-Powered Greenhouses and Yield Prediction",
    location: "Leamington, Canada & Ohio, USA",
    technology: "Computer vision, AI algorithms, and automated robotics.",
    story: "Operating over 175 acres of climate-controlled greenhouses, NatureFresh Farms has completely modernized how produce is grown and harvested. Instead of relying on human guesswork, robotic cameras continuously patrol the greenhouse aisles taking detailed images of blossoms. They feed this data into an AI algorithm that calculates exactly when the produce will turn into fully ripe vegetables. They also utilize automated robotic arms equipped with proprietary AI to detect the health and ripeness of the fruit, plucking them from the vine without damaging the plant. Furthermore, AI adjusts the greenhouse's temperature, water, and fertilizer on a plant-by-plant basis.",
    impact: "NatureFresh Farms can now accurately forecast yields, vastly reduce waste, and expand their farming acreage without worrying about seasonal cycles or labor shortages.",
    source: "https://medium.com/@oretes_research/the-future-of-farming-how-ai-and-technology-are-transforming-agriculture-c13f6b4d32a0",
    icon: Leaf,
    color: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/20"
  },
  {
    id: 2,
    title: "Project 'Saagu Baagu': Empowering Smallholder Farmers",
    location: "Telangana, India",
    technology: "Predictive agricultural analytics, AI-based advisories, and an agricultural data exchange platform.",
    story: "In India, smallholder farmers often struggle with erratic weather, pest infestations, and declining crop yields. To combat this, the World Economic Forum partnered with the government of Telangana to launch Project 'Saagu Baagu' (meaning agricultural advancement). The pilot program focused on over 7,000 chili farmers, giving them access to AI-driven insights delivered straight to their phones. The AI provided predictive models forecasting weather patterns, soil testing data, and early warnings for pest outbreaks so farmers could take proactive measures.",
    impact: "The results from the first phase were highly successful. Participating farmers saw a significant increase in chili yields per acre while simultaneously reducing pesticide and fertilizer use. The quality improvements helped farmers effectively increase their net incomes, and the project is currently scaling to reach 100,000 farmers by 2025.",
    source: "https://www.weforum.org/impact/project-saagu-baagu/",
    icon: Droplets,
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20"
  },
  {
    id: 3,
    title: "Connecterra & 'Ida': The AI Assistant for Dairy Cows",
    location: "Global (Developed in the Netherlands)",
    technology: "Google's TensorFlow machine learning, combined with neck-mounted motion sensors.",
    story: "Technology isn't just for crops; it is revolutionizing livestock management as well. Connecterra developed an intelligent data platform to help dairy farmers track the health and efficiency of their herds. Cows wear a special motion-sensing collar that tracks their movements. The AI learns the behavior of the cows—from when they are chewing and drinking to when they are walking or lying down. The AI analyzes this movement data and translates it into plain-language recommendations sent directly to a farmer's dashboard. It can predict whether a specific cow is falling ill long before physical symptoms show, alert the farmer if a cow is becoming less productive, or indicate when an animal is in heat.",
    impact: "This technology helps farmers resolve issues quickly, rely less on antibiotics, and maintain much healthier, more productive, and sustainable dairy herds by quantifying the direct impact of their farm-management decisions.",
    source: "https://www.connecterra.ai/",
    icon: Cpu,
    color: "from-purple-500 to-indigo-500",
    shadow: "shadow-purple-500/20"
  },
  {
    id: 4,
    title: "Blue River Technology: Precision 'See & Spray' Farming",
    location: "United States",
    technology: "Deep learning algorithms and computer vision attached to John Deere tractor machinery.",
    story: "One of the biggest challenges in traditional agriculture is dealing with weeds. Historically, farmers have had to broadcast-spray entire fields with herbicides to protect their crops, which is costly and damages the surrounding ecosystem. Blue River Technology (a subsidiary of John Deere) solved this by bringing AI directly to the field. They designed a 'See & Spray' machine that uses 36 advanced cameras to scan over 2,500 square feet per second as the tractor drives up to 16 mph. The deep learning algorithms instantly distinguish between a healthy crop (like corn or soybeans) and an invasive weed.",
    impact: "As the tractor moves, the machine triggers targeted micro-jets to spray only the weed with herbicide, while leaving the healthy crops untouched. In recent years, this precision technology has reduced non-residual herbicide use by nearly 50% (saving roughly 31 million gallons of chemicals), saving farmers money and dramatically protecting the soil.",
    source: "https://www.deere.com/en/sprayers/see-spray-ultimate/",
    icon: Target,
    color: "from-orange-500 to-red-500",
    shadow: "shadow-orange-500/20"
  },
  {
    id: 5,
    title: "DeHaat: Full-Stack Agritech Empowering Indian Farmers",
    location: "India",
    technology: "Machine learning models and big data predictive analytics.",
    story: "As one of India's largest full-stack agricultural platforms, DeHaat is using AI to provide farmers with end-to-end services. By collecting data from millions of farmers, their machine learning models provide predictive guidance on what to grow, when to sow, and how to manage crops. They also connect farmers directly with suppliers for seeds and fertilizers, and provide market linkages to sell their produce at the best prices.",
    impact: "DeHaat has significantly optimized yields for smallholder farmers across India, creating a more efficient supply chain that cuts out the middleman and increases the farmer's bottom line.",
    icon: Leaf,
    color: "from-yellow-500 to-orange-500",
    shadow: "shadow-yellow-500/20"
  },
  {
    id: 6,
    title: "Plantix: The 'Digital Doctor' for Crop Diseases",
    location: "Global (Highly active in India)",
    technology: "Computer vision and deep neural networks.",
    story: "Plantix serves as a digital doctor for plants. By utilizing an extensive image database and deep neural networks, farmers can simply take a picture of a diseased leaf or plant using their smartphone. The AI instantly identifies the specific pest, disease, or nutrient deficiency with high accuracy and suggests immediate, actionable treatments in local languages.",
    impact: "This tool has been revolutionary for millions of Indian farmers who previously lacked access to agronomic experts, enabling them to diagnose and treat crop issues before they lead to massive yield losses.",
    icon: Target,
    color: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/20"
  },
  {
    id: 7,
    title: "Cropin: Building the Intelligent Agriculture Cloud",
    location: "India & Global",
    technology: "AI, satellite imagery, and farm data intelligence.",
    story: "Cropin uses artificial intelligence and satellite imagery to provide farm-level data intelligence. Their 'agriculture cloud' platform allows agribusinesses, governments, and farmers to monitor crop health in real-time, predict yields accurately, and ensure complete traceability of produce from the farm to the fork.",
    impact: "By providing actionable predictive insights, Cropin helps farmers mitigate risks from erratic climate patterns and enables financial institutions to assess the creditworthiness of smallholder farmers based on reliable farm data.",
    icon: Cpu,
    color: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/20"
  },
  {
    id: 8,
    title: "Fasal: Precision Microclimatic Forecasts",
    location: "India",
    technology: "IoT sensors and AI-driven microclimate forecasting.",
    story: "Fasal focuses on precision farming by deploying IoT sensors in the field to gather real-time data on soil moisture, temperature, and canopy conditions. The AI analyzes this data to provide highly accurate, farm-specific microclimatic forecasts. It tells farmers exactly when and how much to irrigate, and when to apply fertilizers or pesticides.",
    impact: "Fasal's technology has helped Indian farmers make precise agronomic decisions, notably reducing water consumption by billions of liters and significantly cutting down on chemical pesticide usage.",
    icon: Droplets,
    color: "from-teal-500 to-emerald-500",
    shadow: "shadow-teal-500/20"
  }
]

export default function Stories() {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent mb-4">
          {t('stories.pageTitle', { defaultValue: 'The Future of Farming' })}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('stories.pageDesc', { defaultValue: 'How AI and Technology are Transforming Agriculture. From predictive climate modeling to robotic harvesters and smart dairy sensors, farmers around the globe are partnering with Artificial Intelligence (AI) to increase crop yields, reduce environmental impact, and feed a rapidly growing global population.' })}
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {stories.map((story) => (
          <motion.div
            key={story.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="card-base relative overflow-hidden group border border-gray-100 dark:border-gray-800"
          >
            {/* Header/Banner Area */}
            <div className={`h-2 w-full bg-gradient-to-r ${story.color} absolute top-0 left-0`} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center text-white shadow-lg ${story.shadow}`}>
                  <story.icon size={24} />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t(story.location, { defaultValue: story.location })}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-500 transition-colors">
                {t(story.title, { defaultValue: story.title })}
              </h2>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <Cpu size={16} className="text-green-500" /> {t('stories.techUsed', { defaultValue: 'Technology Used' })}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  {t(story.technology, { defaultValue: story.technology })}
                </p>
              </div>

              <div className="mb-4 space-y-2">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {t(story.story, { defaultValue: story.story })}
                </p>
              </div>
              
              <div className="mt-6 mb-6">
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-100 dark:border-green-900/20">
                  <h3 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 uppercase tracking-wide">
                    {t('stories.impact', { defaultValue: 'The Impact' })}
                  </h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                    {t(story.impact, { defaultValue: story.impact })}
                  </p>
                </div>
              </div>

              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(story.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                {t('stories.readOriginal', { defaultValue: 'Read Original Story' })} <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
