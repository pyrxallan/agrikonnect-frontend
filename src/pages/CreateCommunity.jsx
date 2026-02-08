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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Only experts and admins can create communities. Farmers can join existing communities.
          </p>
          <button 
            onClick={() => navigate('/communities')} 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Community
          </h2>
          <button 
            onClick={() => navigate('/communities')} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* community name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Community Name 
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} // updates name field
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* category dropdown menu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} // updates category field
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          {/* description textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} // updates description field
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* buttons for creating and cancle*/}
          <div className="flex gap-3 pt-4">
            {/* submit button - disabled while loading */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/communities')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;