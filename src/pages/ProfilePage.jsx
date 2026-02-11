import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, Edit2, MessageCircle, X, Camera, Upload, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ posts: 0, communities: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile = !userId || userId == currentUser?.id;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const id = userId || currentUser?.id;
      const { data } = await api.get(`/users/${id}`);
      setProfile(data);
      setStats({ posts: data.posts_count || 0, communities: data.communities_count || 0 });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const id = userId || currentUser?.id;
      const { data } = await api.get(`/posts?author_id=${id}`);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handlePhotoUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    try {
      const { data } = await api.post(`/users/${profile.id}/upload-photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, [type === 'profile' ? 'profile_image' : 'cover_image']: data.url });
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload photo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-500">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 md:pb-8">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        {profile.cover_image ? (
          <img src={profile.cover_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary via-secondary to-primary" />
        )}
        {isOwnProfile && (
          <label className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full cursor-pointer hover:bg-white transition-all shadow-lg flex items-center gap-2">
            <Camera size={16} className="md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">Edit Cover</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files[0] && handlePhotoUpload(e.target.files[0], 'cover')}
            />
          </label>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-3 md:px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 lg:p-8">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            {/* Profile Photo */}
            <div className="relative -mt-12 md:-mt-16">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt={profile.first_name} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-white md:w-16 md:h-16" />
                )}
              </div>
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-secondary text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-primary transition-colors cursor-pointer">
                  <Camera size={16} className="md:w-5 md:h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handlePhotoUpload(e.target.files[0], 'profile')}
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center w-full">
              <div className="flex flex-col items-center gap-2 md:gap-3 mb-3">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h1>
                <span className={`inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-sm ${
                  profile.role === 'expert' 
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                }`}>
                  {profile.role === 'expert' ? '🌟 Expert' : '🌾 Farmer'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-4">
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-secondary md:w-4 md:h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-1.5">
                    <span>📞 {profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-secondary md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  <span className="sm:hidden">{new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 max-w-2xl leading-relaxed px-2">{profile.bio}</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 justify-center">
                {isOwnProfile ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm md:text-base"
                  >
                    <Edit2 size={16} className="md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/messages')}
                    className="px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm md:text-base"
                  >
                    <MessageCircle size={16} className="md:w-5 md:h-5" />
                    Message
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="glass bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl md:rounded-2xl p-4 md:p-5 text-center border border-primary/10">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.posts}</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Posts</div>
            </div>
            <div className="glass bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl md:rounded-2xl p-4 md:p-5 text-center border border-primary/10">
              <div className="text-2xl md:text-3xl font-bold text-primary">{stats.communities}</div>
              <div className="text-xs md:text-sm text-gray-600 font-medium mt-1">Communities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-3 md:px-4 mt-6 md:mt-8">
        <div className="flex gap-4 md:gap-6 border-b-2 border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2 md:pb-3 px-2 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
              activeTab === 'posts'
                ? 'text-primary border-b-3 border-primary -mb-0.5'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('communities')}
            className={`pb-2 md:pb-3 px-2 font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
              activeTab === 'communities'
                ? 'text-primary border-b-3 border-primary -mb-0.5'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Communities
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 md:mt-6">
          {activeTab === 'posts' && (
            <div className="space-y-3 md:space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 md:py-16 text-gray-500">
                  <p className="text-base md:text-lg">No posts yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="glass bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 hover:shadow-md transition-all border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.comments_count || 0} comments</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="text-center py-12 md:py-16 text-gray-500">
              <p className="text-base md:text-lg">Communities feature coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => {
            setProfile(updated);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    location: profile.location || '',
    farm_size: profile.farm_size || '',
    crops: profile.crops || '',
    is_public: profile.is_public !== false,
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put(`/users/${profile.id}`, formData);
      onSave(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/users/${profile.id}/password`, {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      alert('Password changed successfully');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="glass bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl p-6 md:p-8 border-b border-gray-100 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Section Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveSection('personal')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSection === 'personal'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSection === 'password'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setActiveSection('privacy')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSection === 'privacy'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Privacy
            </button>
          </div>

          {/* Personal Info Section */}
          {activeSection === 'personal' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+254 700 000 000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Farm Size (acres)</label>
                <input
                  type="text"
                  value={formData.farm_size}
                  onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g., 5 acres"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crops/Livestock</label>
                <input
                  type="text"
                  value={formData.crops}
                  onChange={(e) => setFormData({ ...formData, crops: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g., Maize, Beans"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg disabled:opacity-50 font-semibold transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Password Section */}
        {activeSection === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg disabled:opacity-50 font-semibold transition-all"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">
                    Make your profile visible to other users. When disabled, only you can see your profile.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg disabled:opacity-50 font-semibold transition-all"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
