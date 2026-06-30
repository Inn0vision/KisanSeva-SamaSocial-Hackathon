import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  CloudRain, Recycle, Droplets, Waves, Fish, 
  Leaf, Sprout, Sun, Cloud, Cpu, Plus, CheckCircle2, ExternalLink
} from 'lucide-react'

const waterConcepts = [
  {
    id: "rainwater",
    title: "Rainwater Harvesting Systems",
    description: "Catchment areas and storage tank integrations to capture and utilize natural rainfall for irrigation.",
    icon: CloudRain,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-400/50"
  },
  {
    id: "greywater",
    title: "Greywater Recycling",
    description: "Filtering runoff from sinks and washing facilities for safe, non-potable agricultural use.",
    icon: Recycle,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "group-hover:border-teal-400/50"
  },
  {
    id: "drip",
    title: "Drip Irrigation Optimization",
    description: "Delivering water directly to root zones to minimize evaporation and maximize efficiency.",
    icon: Droplets,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "group-hover:border-emerald-400/50"
  },
  {
    id: "runoff",
    title: "Agricultural Runoff Collection",
    description: "Designing retention ponds and natural bio-swales to capture and filter nutrient-rich runoff.",
    icon: Waves,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "group-hover:border-cyan-400/50"
  },
  {
    id: "aquaponics",
    title: "Aquaponics & Hydroponics Loops",
    description: "Closed-loop systems where fish effluent and plant water are continuously recycled and purified.",
    icon: Fish,
    color: "text-blue-300",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-400/50"
  },
  {
    id: "wetlands",
    title: "Constructed Wetlands",
    description: "Using natural plant ecosystems and bio-filtration to purify heavily used blackwater.",
    icon: Leaf,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "group-hover:border-green-400/50"
  },
  {
    id: "soil",
    title: "Soil Moisture Conservation",
    description: "Mulching, cover crops, and organic matter management to retain water in the soil ecosystem.",
    icon: Sprout,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50"
  },
  {
    id: "solar",
    title: "Solar-Powered Desalination",
    description: "Using renewable solar energy to purify brackish groundwater for sustainable irrigation.",
    icon: Sun,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "group-hover:border-yellow-400/50"
  },
  {
    id: "atmospheric",
    title: "Atmospheric Water Generation",
    description: "Condensing ambient humidity from the air for greenhouse use in arid environments.",
    icon: Cloud,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "group-hover:border-sky-400/50"
  },
  {
    id: "iot",
    title: "Smart Water Metering & IoT",
    description: "Visualizing leak detection and automated water flow management using smart sensors.",
    icon: Cpu,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "group-hover:border-indigo-400/50"
  }
];

export default function Waste() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-x-0', 'scale-100');
          entry.target.classList.remove('opacity-0', 'translate-x-10', 'scale-95');
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) revealObserver.observe(ref);
    });

    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 px-6 lg:px-8 rounded-3xl bg-[#0a192f] shadow-2xl shadow-blue-900/20 mb-16 border border-blue-900/30">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/30 via-transparent to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            {t('waste.titleMain', { defaultValue: 'Water Recycling &' })} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
              {t('waste.titleSub', { defaultValue: 'Agricultural Water Management' })}
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('waste.heroDesc', { defaultValue: 'Discover 10 comprehensive strategies to optimize, recycle, and manage water resources for a sustainable farming future.' })}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative flex items-start gap-12">
        
        {/* Sticky Sidebar Navigation (Desktop) */}
        <div className="hidden lg:block sticky top-24 w-72 shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-widest text-teal-500 mb-6">{t('waste.navigatingConcepts', { defaultValue: 'Navigating Concepts' })}</h3>
          <ul className="space-y-4 border-l border-slate-800 relative">
            {waterConcepts.map((concept) => (
              <li key={`nav-${concept.id}`}>
                <a 
                  href={`#${concept.id}`}
                  className={`block pl-5 py-1 text-sm font-medium transition-all duration-300 border-l-2 -ml-[1px] ${
                    activeSection === concept.id 
                      ? 'border-teal-400 text-teal-300' 
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(concept.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t(concept.title, { defaultValue: concept.title })}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-24">
          {waterConcepts.map((concept, index) => (
            <section 
              key={concept.id}
              id={concept.id}
              ref={el => sectionRefs.current[index] = el}
              className="group opacity-0 translate-x-10 scale-95 transition-all duration-1000 ease-out scroll-mt-24"
            >
              <div className={`relative p-8 md:p-10 rounded-3xl bg-[#0f172a]/80 backdrop-blur-sm border border-slate-800 ${concept.border} transition-colors duration-500 overflow-hidden shadow-xl shadow-black/20`}>
                {/* Ambient background glow */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${concept.bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 opacity-50`}></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className={`p-5 rounded-2xl ${concept.bg} border border-slate-700/50 shrink-0 shadow-inner`}>
                    <concept.icon className={`w-12 h-12 ${concept.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono font-bold tracking-wider text-teal-400/80 bg-teal-400/10 border border-teal-400/20 px-2 py-1 rounded">
                        0{index + 1}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
                        {t(concept.title, { defaultValue: concept.title })}
                      </h2>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-lg mt-4 max-w-2xl">
                      {t(concept.description, { defaultValue: concept.description })}
                    </p>
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(concept.title + " agriculture water")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      {t('seeMore', { defaultValue: 'See more' })} <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          ))}

        </div>
      </div>
    </div>
  )
}
