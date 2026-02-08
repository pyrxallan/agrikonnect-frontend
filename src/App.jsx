import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/auth';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout component for pages with header
const Layout = ({ children }) => (
  <>
    <Header />
    <div className="pt-20">
      {children}
    </div>
    <Footer />
  </>
);

// Home layout without padding
const HomeLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

// Placeholder components for protected routes
const Posts = () => <div className="p-8">Posts Page - Coming Soon</div>;
const Communities = () => <div className="p-8">Communities Page - Coming Soon</div>;
const Experts = () => <div className="p-8">Experts Page - Coming Soon</div>;
const Messages = () => <div className="p-8">Messages Page - Coming Soon</div>;
const Profile = () => <div className="p-8">Profile Page - Coming Soon</div>;
const Notifications = () => <div className="p-8">Notifications Page - Coming Soon</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout><HomePage /></HomeLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts" element={<ProtectedRoute><Layout><Posts /></Layout></ProtectedRoute>} />
      <Route path="/communities" element={<ProtectedRoute><Layout><Communities /></Layout></ProtectedRoute>} />
      <Route path="/experts" element={<ProtectedRoute><Layout><Experts /></Layout></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;