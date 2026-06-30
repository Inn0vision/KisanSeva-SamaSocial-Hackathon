import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, MapPin, Loader2, Navigation, Sprout, Tractor, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import { State, City } from 'country-state-city';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  mainCrop: z.string().min(2, 'Main crop is required'),
  landSize: z.string().min(1, 'Land size is required'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SetupProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const selectedState = watch('state');
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all states for India (country code 'IN')
    setStates(State.getStatesOfCountry('IN'));
  }, []);

  useEffect(() => {
    if (selectedState) {
      // selectedState contains the isoCode of the state
      const stateIsoCode = selectedState.split('|')[0];
      setCities(City.getCitiesOfState('IN', stateIsoCode));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // Extract the actual names instead of isoCode|name format
      const finalData = {
        ...data,
        state: data.state.split('|')[1] || data.state,
      };
      
      await updateProfile(finalData);
      toast.success('Profile setup complete! Welcome to KisanSeva.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0d1117] flex">
      {/* Left Side - Image & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#16a34a] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="/profile_bg.png" 
          alt="Agriculture Field" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-center h-full p-16 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Leaf className="text-white" size={28} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">KisanSeva</h1>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Personalize Your <br/> Farming Experience
            </h2>
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              Tell us a little bit about your farm, location, and crops so we can provide you with hyper-local weather alerts, relevant government schemes, and precise crop care advice.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete your profile
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Just a few details to get your personalized dashboard ready.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserCircle size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm"
                  placeholder="e.g. Ramesh Kumar"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  State (India)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Navigation size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                  </div>
                  <select
                    {...register('state')}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm appearance-none"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={`${state.isoCode}|${state.name}`}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.state && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.state.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  City / District
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                  </div>
                  <select
                    {...register('city')}
                    disabled={!selectedState}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-[#0d1117]"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.city && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.city.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Main Crop
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Sprout size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                  </div>
                  <input
                    type="text"
                    {...register('mainCrop')}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm"
                    placeholder="e.g. Wheat, Rice"
                  />
                </div>
                {errors.mainCrop && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.mainCrop.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Land Size (Acres)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Tractor size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    {...register('landSize')}
                    className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm"
                    placeholder="e.g. 5.5"
                  />
                </div>
                {errors.landSize && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.landSize.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] mt-8"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Complete Setup & Enter Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
