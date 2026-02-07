import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { communitiesService } from '../services/communitiesService';
import CommunityChat from '../components/CommunityChat';
import { useAppSelector } from '../app/hooks';

// community detail page that shows details about a single community with view, edit, join/leave, and chat functionality
const CommunityDetails = () => {
  const { id } = useParams(); // gets community ID from the url, and params extracts parameter form the rl path
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth); //it gets the current logged-in user
  const [community, setCommunity] = useState(null); // stores the comuunity data
  const [editing, setEditing] = useState(false); // toggle edit mode
  const [showChat, setShowChat] = useState(true); // toggle chat visibility
  const [formData, setFormData] = useState(''); // temporary storage for description edits

  // fetch community data on mount or when ID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await communitiesService.getCommunity(id);
        // normalize field names to ensure consistent naming the component
        setCommunity({ 
          ...data, 
          is_member: data.is_member || data.isJoined, 
          members_count: data.members_count || data.members 
        });
        setFormData(data.description);
      } catch {
        // fallback data if API fails that prevents tha app form crashing
        setCommunity({ 
          id, 
          name: 'Community', 
          description: 'Community description', 
          members_count: 0, 
          is_member: true, 
          created_at: new Date().toISOString() 
        });
      }
    };
    fetchData();
  }, [id]);

  // save edited description of the community
  const handleSave = async () => {
    try {
      const updated = await communitiesService.updateCommunity(id, { description: formData });
      setCommunity(updated);
      setEditing(false);
      alert('Community updated successfully!');
    } catch { 
      alert('Failed to update community'); 
    }
  };

  // function that handles delete functionality to the entire community (admin only)
  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) return;
    try {
      await communitiesService.deleteCommunity(id);
      alert('Community deleted successfully!');
      navigate('/communities');
    } catch { 
      alert('Failed to delete community'); 
    }
  };

  // toggle membership: join if not member, leave if member
  const handleJoin = async () => {
    try {
      const response = community.is_member 
        ? await communitiesService.leaveCommunity(id) 
        : await communitiesService.joinCommunity(id);
      if (response.community) {
        // update membership status and member count
        setCommunity(prev => ({ 
          ...prev, 
          is_member: !community.is_member, 
          members_count: response.community.members 
        }));
      }
    } catch (err) {
      // re-fetch if state is out of sync to prevent the 400 bad request error
      if (err.response?.status === 400) {
        setCommunity(await communitiesService.getCommunity(id));
      }
    }
  };

  // check if current user is the community creator hence he/she can delete community
  const isAdmin = user?.id === community?.creator_id;
  
  if (!community) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/communities')} 
          className="flex items-center gap-2 text-green-600 dark:text-green-600 hover:text-green-700 mb-2"
        >
         Back to Communities
        </button>
        
        {/* header with community name and action buttons */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {community.name}
          </h1>
          
          <div className="flex gap-3">
            {/* join/leave button */}
            <button 
              onClick={handleJoin} 
              className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700"
            >
              {community.is_member ? 'Leave' : 'Join'}
            </button>
            {/* toggle chat visibility */}
            <button 
              onClick={() => setShowChat(!showChat)} 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {showChat ? 'Hide Chat' : 'Show Chat'}
            </button>
            {/* Admin controls - only visible to creator */}
            {isAdmin && (editing ? (
              <>
                <button 
                  onClick={handleSave} 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditing(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setEditing(true)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete} 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              {editing ? (
                <textarea 
                  value={formData} 
                  onChange={(e) => setFormData(e.target.value)} 
                  rows={4} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  {community.description}
                </p>
              )}
              
              {/* it shows the number of community */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Members
                  </label>
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {community.members_count || 0}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Created
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(community.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* chat is only visible to members */}
            {showChat && community.is_member && (
              <CommunityChat communityId={id} communityName={community.name} />
            )}
            
            {/* join prompt for non-members */}
            {showChat && !community.is_member && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Join this community to access the chat
                </p>
                <button 
                  onClick={handleJoin} 
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Join Community
                </button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Community Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {community.is_member ? 'Member' : 'Not a member'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Category:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {community.category || 'General'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
