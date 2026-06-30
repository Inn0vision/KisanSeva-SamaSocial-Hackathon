import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
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
          src="/login_bg.png" 
          alt="Agriculture Tech" 
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
              Welcome back to <br/> your Digital Farm
            </h2>
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              Log in to check your personalized dashboard, track weather conditions, and get actionable insights for a better yield.
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
              Sign In
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Access your personalized farming dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm"
                  placeholder="farmer@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-[#16a34a] transition-colors" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-[#30363d] rounded-xl bg-white dark:bg-[#161b22] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] mt-8"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#16a34a] hover:text-[#15803d] transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
