import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const HomePage = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-background.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block glass-dark rounded-full px-4 py-2 mb-6">
                <span className="text-secondary font-semibold text-sm">🌾 Africa's Leading Agricultural Network</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Grow Smarter,<br />
                <span className="text-secondary">Farm Better</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                Join farmers connecting with experts, sharing knowledge, and transforming agriculture across Africa.
              </p>

              {token && user ? (
                <div className="space-y-6">
                  <p className="text-xl text-white">
                    Welcome back, <span className="text-secondary font-semibold">{user.first_name}</span>! 👋
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/posts" className="bg-secondary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Explore Feed
                    </Link>
                    <Link to="/communities" className="glass-dark text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all">
                      Browse Communities
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="bg-secondary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                    Start Free Today <span>→</span>
                  </Link>
                </div>
              )}

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  <img src="/farmer-1.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  <img src="/farmer-3.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                  <img src="/farmer-4.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                </div>
                <div className="text-white">
                  <div className="font-bold">10,000+ Farmers</div>
                  <div className="text-sm text-gray-300">Growing together</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img src="/farmer-1.jpg" alt="Farmer" className="rounded-2xl shadow-2xl w-full h-64 object-cover" />
                  <img src="/farmer-4.jpg" alt="Farm" className="rounded-2xl shadow-2xl w-full h-48 object-cover" />
                </div>
                <div className="space-y-4 pt-8">
                  <img src="/farmer-3.jpg" alt="Farmer" className="rounded-2xl shadow-2xl w-full h-48 object-cover" />
                  <img src="/farmer-6.jpg" alt="Farmer" className="rounded-2xl shadow-2xl w-full h-64 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">500+</div>
              <div className="text-gray-600 font-medium">Expert Advisors</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">100+</div>
              <div className="text-gray-600 font-medium">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Solutions Shared</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full px-6 lg:px-8">
          <div className="text-center mb-16 max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-secondary">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access expert knowledge, connect with fellow farmers, and grow your agricultural business with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="glass bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant access to certified agricultural experts. Ask questions, receive personalized advice, and learn best practices.
              </p>
            </div>

            <div className="glass bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Thriving Communities</h3>
              <p className="text-gray-600 leading-relaxed">
                Join specialized farming communities. Share experiences, solve problems together, and build lasting connections.
              </p>
            </div>

            <div className="glass bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified & Trusted</h3>
              <p className="text-gray-600 leading-relaxed">
                All experts are verified professionals. Your data is secure, and our community guidelines ensure quality interactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="w-full px-6 lg:px-8">
          <div className="text-center mb-16 max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How <span className="text-secondary">Agrikonnect</span> Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to transform your farming journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-secondary">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">Sign up in minutes and tell us about your farming interests and challenges.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-secondary">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect & Learn</h3>
              <p className="text-gray-600">Join communities, follow experts, and engage with content relevant to your needs.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-secondary">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Grow Your Farm</h3>
              <p className="text-gray-600">Apply insights, share your success, and help others in the community thrive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="/farm-2.avif" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-secondary/95" />
        </div>
        <div className="relative z-10 w-full px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-white/90">Real farmers, real results</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="glass-dark p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <img src="/farmer-1.jpg" alt="" className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                <div>
                  <div className="font-bold text-lg">James Mwangi</div>
                  <div className="text-white/80">Maize Farmer, Nakuru</div>
                </div>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                "Agrikonnect helped me increase my yield by 40%. Through expert advice and community support, I learned modern farming techniques that transformed my maize farm."
              </p>
            </div>
            <div className="glass-dark p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <img src="/farmer-4.jpg" alt="" className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                <div>
                  <div className="font-bold text-lg">Emily Ololchoki</div>
                  <div className="text-white/80">Dairy Farmer, Kiambu</div>
                </div>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                "The expert network is incredible. I got solutions to my dairy farming challenges within hours. My milk production has doubled in 6 months!"
              </p>
            </div>
            <div className="glass-dark p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <img src="/farmer-3.jpg" alt="" className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                <div>
                  <div className="font-bold text-lg">Peter Kioko</div>
                  <div className="text-white/80">Fruit farmer, Kitui</div>
                </div>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                "I learned about organic farming methods from the community. Now my mangoes fetch premium prices at the market. Best decision ever!"
              </p>
            </div>
            <div className="glass-dark p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <img src="/farmer-6.jpg" alt="" className="w-16 h-16 rounded-full border-4 border-white object-cover" />
                <div>
                  <div className="font-bold text-lg">Samoe Will</div>
                  <div className="text-white/80">Wheat Farmer, Narok</div>
                </div>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                "The disease management tips I got from experts saved my entire coffee plantation. Agrikonnect is a lifesaver for farmers like me."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="py-24 bg-gray-900 text-white">
          <div className="w-full px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-4xl mx-auto">
              Join thousands of farmers already growing smarter with Agrikonnect. Get started today—it's completely free.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="bg-secondary text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Create Free Account
              </Link>
              <Link to="/login" className="glass-dark text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                Sign In
              </Link>
            </div>
            <p className="mt-6 text-gray-400 text-sm">No credit card required • Free forever • Join in 2 minutes</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
