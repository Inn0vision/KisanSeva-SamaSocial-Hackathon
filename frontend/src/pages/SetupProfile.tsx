import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, MapPin, Loader2, Navigation, Sprout, Tractor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  mainCrop: z.string().min(2, 'Main crop is required'),
  landSize: z.string().min(1, 'Land size is required'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SetupProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast.success('Profile setup complete!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0d1117] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#161b22] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#30363d]"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#ecfdf5] dark:bg-[#132c1e] flex items-center justify-center border-4 border-white dark:border-[#161b22] shadow-sm">
              <UserCircle className="text-[#16a34a] dark:text-[#3fb950]" size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Complete your profile
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Tell us where you farm so we can provide accurate weather and schemes.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-[#30363d] rounded-lg bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors"
                  placeholder="Ramesh Kumar"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  City / District
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('city')}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-[#30363d] rounded-lg bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors"
                    placeholder="Nashik"
                  />
                </div>
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Navigation size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('state')}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-[#30363d] rounded-lg bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors"
                    placeholder="Maharashtra"
                  />
                </div>
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Main Crop
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Sprout size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('mainCrop')}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-[#30363d] rounded-lg bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors"
                    placeholder="E.g., Soybean"
                  />
                </div>
                {errors.mainCrop && <p className="mt-1 text-sm text-red-500">{errors.mainCrop.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Land Size (Acres)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tractor size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    {...register('landSize')}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-[#30363d] rounded-lg bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition-colors"
                    placeholder="E.g., 5.5"
                  />
                </div>
                {errors.landSize && <p className="mt-1 text-sm text-red-500">{errors.landSize.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-6"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Complete Setup'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
