import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/70 z-10" />
        <img src="/farm-1.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/agrikkonect-logo.png" alt="Agrikonnect" className="h-10" />
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">Empowering farmers with knowledge, connecting communities, and cultivating success together.</p>
            <div className="flex gap-4">
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <img src="/tik-tok.png" alt="TikTok" className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <img src="/twitter.png" alt="Twitter" className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <img src="/instagram.png" alt="Instagram" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase mb-6 pb-2 border-b-2 border-secondary">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Blog & News</Link></li>
              <li><Link to="/communities" className="text-gray-300 hover:text-secondary transition-colors">Communities</Link></li>
              <li><Link to="/experts" className="text-gray-300 hover:text-secondary transition-colors">Find Experts</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase mb-6 pb-2 border-b-2 border-secondary">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">FAQs</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-secondary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase mb-6 pb-2 border-b-2 border-secondary">Newsletter</h4>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">Get weekly farming insights, expert tips, and community updates delivered to your inbox.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-l-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white/20 transition-colors"
              />
              <button className="bg-secondary text-white px-6 py-3 rounded-r-full hover:bg-primary transition-colors font-semibold">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Agrikonnect. All rights reserved. | Cultivating connections, growing futures.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
