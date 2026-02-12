import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from '../../features/auth/authSlice';

const farmImages = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
];

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, isLoading, error } = useAppSelector((state) => state.auth);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (token && !isLoading) {
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [token, isLoading, navigate, from]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % farmImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE - Image Carousel */}
      <div className="relative lg:w-1/2 h-64 lg:h-screen overflow-hidden order-2 lg:order-1">
        {farmImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt="Farm" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
        
        {/* Logo - clickable to go home */}
        <Link to="/" className="absolute top-6 left-6 z-10 hover:opacity-80 transition-opacity">
          <img src="/agrikkonect-logo.png" alt="Agrikonnect" className="h-12" />
        </Link>

        {/* Back to website */}
        <Link
          to="/"
          className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white flex items-center gap-2 hover:bg-white/20 transition-all"
        >
          <span className="text-sm font-medium">Back to website</span>
          <ArrowRight size={18} />
        </Link>

        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Grow Smarter, Farm Better
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-md">
            Join farmers connecting with experts across Africa
          </p>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {farmImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentImage ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="lg:w-1/2 bg-[#1A2F23] flex items-center justify-center p-6 lg:p-12 order-1 lg:order-2">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="mt-2 text-gray-300">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#6BAF7D] hover:text-[#5a9e6c] font-medium">
                Create account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                {error.message || 'Login failed. Please try again.'}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password required' })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#6BAF7D] focus:ring-[#6BAF7D] focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#6BAF7D] hover:text-[#5a9e6c]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6BAF7D] hover:bg-[#5a9e6c] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
