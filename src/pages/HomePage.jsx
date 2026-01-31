import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const HomePage = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative circle */}
      <div className="pointer-events-none select-none absolute left-1/2 transform -translate-x-1/2 -z-10 -bottom-24 w-[400px] h-[400px] bg-black rounded-full opacity-5 sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] md:-bottom-32"></div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Agrikonnect
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connecting farmers, agricultural experts, and communities worldwide.
            Share knowledge, find solutions, and grow together.
          </p>

          {token && user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Welcome back, {user.first_name}! Ready to explore?
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <Link to="/posts" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                  View Posts
                </Link>
                <Link to="/communities" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                  Join Communities
                </Link>
                <Link to="/experts" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                  Find Experts
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Link to="/register" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/login" className="btn-primary bg-transparent border-2 border-white hover:bg-white hover:text-primary">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">
              Why Choose Agrikonnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a thriving community dedicated to advancing agriculture through knowledge sharing and collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Expert Knowledge</h3>
              <p className="text-gray-600">
                Connect with agricultural experts and get answers to your farming questions.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Community Support</h3>
              <p className="text-gray-600">
                Join communities of farmers facing similar challenges and share solutions.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                Your data is safe with us. Connect with verified agricultural professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-text mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and experts already using Agrikonnect to improve their agricultural practices.
            </p>
            <div className="space-x-4">
              <Link to="/register" className="btn-primary">
                Create Free Account
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;