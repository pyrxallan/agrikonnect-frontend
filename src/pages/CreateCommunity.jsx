import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communitiesService } from '../services/communitiesService';
import { useAppSelector } from '../app/hooks';

// create community component where only only experts and admins can access
const CreateCommunity = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth); // current logged-in user and checks if the current user has permissin to create community
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    category: '' 
  });
  const [loading, setLoading] = useState(false); // track form submission state and prevent double submission

  // check if user has permission to create communities
  const canCreateCommunity = user?.role === 'expert' || user?.role === 'admin';

  // handle form submission, called when user click create button
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    try {
      await communitiesService.createCommunity(formData);
      alert('Community created successfully!');
      navigate('/communities');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create community');
      setLoading(false); // re-enable submit button so users can try again
    }
  };

  // block unauthorized users (farmers), if user doesn't have permission, it shows access denied
  if (!canCreateCommunity) {
    return (
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/farm_page.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-8 py-12">
          <div className="glass bg-white rounded-3xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              Only experts and admins can create communities. Farmers can join existing communities.
            </p>
            <button 
              onClick={() => navigate('/communities')} 
              className="px-6 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg"
            >
              Back to Communities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/farm_page.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate('/communities')} 
          className="flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold mb-6 transition-all"
        >
          ← Back to Communities
        </button>

        <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Community
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Community Name 
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="glass w-full px-4 py-3 border border-gray-200 rounded-2xl  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="glass w-full px-4 py-3 border border-gray-200 rounded-2xl  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select category</option>
                <option value="Sustainable Agriculture">Sustainable Agriculture</option>
                <option value="Plant Health">Plant Health</option>
                <option value="Water Management">Water Management</option>
                <option value="Animal Husbandry">Animal Husbandry</option>
                <option value="Climate Adaptation">Climate Adaptation</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="glass w-full px-4 py-3 border border-gray-200 rounded-2xl  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/communities')}
                className="flex-1 px-6 py-3 glass bg-white/40 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;