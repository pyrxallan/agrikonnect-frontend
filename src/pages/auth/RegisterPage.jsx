import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register as registerUser, clearError } from '../../features/auth/authSlice';

const farmImages = [
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
];

const specialties = [
  'Crop Production',
  'Livestock Management',
  'Soil Science',
  'Pest Control',
  'Irrigation Systems',
  'Organic Farming',
  'Agricultural Economics',
  'Farm Machinery',
  'Horticulture',
  'Agronomy',
];

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, isLoading, error } = useAppSelector((state) => state.auth);
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');
  const userType = watch('userType');

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

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
    const { confirmPassword, terms, ...userData } = data;
    dispatch(registerUser(userData));
  };

  return (
    <>
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
          
          <Link to="/" className="absolute top-6 left-6 z-10 hover:opacity-80 transition-opacity">
            <img src="/agrikkonect-logo.png" alt="Agrikonnect" className="h-12" />
          </Link>

          <Link
            to="/"
            className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            <span className="text-sm font-medium">Back to website</span>
            <ArrowRight size={18} />
          </Link>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Grow Smarter, Farm Better
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-md">
              Join farmers connecting with experts across Africa
            </p>
          </div>

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
        <div className="lg:w-1/2 bg-[#1A2F23] flex items-center justify-center p-6 lg:p-12 order-1 lg:order-2 overflow-y-auto">
          <div className="max-w-md w-full space-y-6 my-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Create an account</h2>
              <p className="mt-2 text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-[#6BAF7D] hover:text-[#5a9e6c] font-medium">
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
                  {error.message || 'Registration failed. Please try again.'}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName', { required: 'Required' })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName', { required: 'Required' })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' },
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-1">
                  I am a
                </label>
                <select
                  id="userType"
                  {...register('userType', { required: 'Please select your role' })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all"
                >
                  <option value="" className="bg-[#1A2F23]">Select your role</option>
                  <option value="farmer" className="bg-[#1A2F23]">Farmer</option>
                  <option value="expert" className="bg-[#1A2F23]">Agricultural Expert</option>
                </select>
                {errors.userType && <p className="mt-1 text-xs text-red-400">{errors.userType.message}</p>}
              </div>

              {userType === 'expert' && (
                <div className="animate-fadeIn">
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-300 mb-1">
                    Specialty
                  </label>
                  <select
                    id="specialties"
                    {...register('specialties', { required: userType === 'expert' ? 'Please select your specialty' : false })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-[#1A2F23]">Select your specialty</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty} className="bg-[#1A2F23]">
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {errors.specialties && <p className="mt-1 text-xs text-red-400">{errors.specialties.message}</p>}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all pr-12"
                    placeholder="Create a strong password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6BAF7D] focus:border-transparent transition-all pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms', { required: 'You must accept the terms' })}
                  className="h-4 w-4 mt-1 rounded border-white/10 bg-white/5 text-[#6BAF7D] focus:ring-[#6BAF7D] focus:ring-offset-0"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#6BAF7D] hover:text-[#5a9e6c] underline"
                  >
                    Terms & Conditions
                  </button>
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6BAF7D] hover:bg-[#5a9e6c] text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 text-gray-700">
              <h4 className="font-semibold text-lg">1. Acceptance of Terms</h4>
              <p>By accessing and using Agrikonnect, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h4 className="font-semibold text-lg">2. Use License</h4>
              <p>Permission is granted to temporarily use Agrikonnect for personal, non-commercial transitory viewing only.</p>
              
              <h4 className="font-semibold text-lg">3. User Accounts</h4>
              <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
              
              <h4 className="font-semibold text-lg">4. Content Guidelines</h4>
              <p>Users must not post content that is offensive, defamatory, or violates any laws. Agrikonnect reserves the right to remove any content that violates these terms.</p>
              
              <h4 className="font-semibold text-lg">5. Expert Advice Disclaimer</h4>
              <p>Information provided by experts on this platform is for educational purposes only. Always consult with certified professionals for specific agricultural decisions.</p>
              
              <h4 className="font-semibold text-lg">6. Privacy</h4>
              <p>Your privacy is important to us. We collect and use your information in accordance with our Privacy Policy.</p>
              
              <h4 className="font-semibold text-lg">7. Modifications</h4>
              <p>Agrikonnect reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>
            </div>
            <div className="p-6 border-t">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-[#6BAF7D] hover:bg-[#5a9e6c] text-white font-semibold py-3 rounded-lg transition-all"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
