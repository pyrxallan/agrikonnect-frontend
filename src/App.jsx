import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/auth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FeedPage from './pages/posts/FeedPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityDetails from './pages/CommunityDetails';
import CreateCommunity from './pages/CreateCommunity';
import ExpertsPage from './pages/ExpertsPage';
import ExpertProfilePage from './pages/ExpertProfilePage';

const Layout = ({ children }) => (
  <>
    <Header />
    <div className="pt-16">
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

// Placeholder components for routes not yet implemented
const Messages = () => <div className="p-8">Messages Page - Coming Soon</div>;
const Profile = () => <div className="p-8">Profile Page - Coming Soon</div>;
const Notifications = () => <div className="p-8">Notifications Page - Coming Soon</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/posts" element={<ProtectedRoute><Layout><FeedPage /></Layout></ProtectedRoute>} />
      <Route path="/communities" element={<ProtectedRoute><Layout><CommunitiesPage /></Layout></ProtectedRoute>} />
      <Route path="/communities/create" element={<ProtectedRoute><Layout><CreateCommunity /></Layout></ProtectedRoute>} />
      <Route path="/communities/:id" element={<ProtectedRoute><Layout><CommunityDetails /></Layout></ProtectedRoute>} />
      <Route path="/experts" element={<ProtectedRoute><Layout><ExpertsPage /></Layout></ProtectedRoute>} />
      <Route path="/experts/:id" element={<ProtectedRoute><Layout><ExpertProfilePage /></Layout></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
