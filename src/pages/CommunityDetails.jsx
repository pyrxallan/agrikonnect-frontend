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
      await (community.is_member 
        ? communitiesService.leaveCommunity(id) 
        : communitiesService.joinCommunity(id));
      
      // refetch community to get updated data
      const updated = await communitiesService.getCommunity(id);
      setCommunity({ 
        ...updated, 
        is_member: updated.is_member || updated.isJoined, 
        members_count: updated.members_count || updated.members 
      });
    } catch (err) {
      console.error('Failed to update membership:', err);
      // re-fetch on error to sync state
      const data = await communitiesService.getCommunity(id);
      setCommunity({ 
        ...data, 
        is_member: data.is_member || data.isJoined, 
        members_count: data.members_count || data.members 
      });
    }
  };

  // check if current user is the community creator hence he/she can delete community
  const isAdmin = user?.id === community?.creator_id;
  
  if (!community) return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center"><div className="text-gray-600 text-xl">Loading...</div></div>;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/farm_page.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate('/communities')} 
          className="flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold mb-6 transition-all"
        >
          ← Back to Communities
        </button>

        {/* header with community name and action buttons */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {community.name}
          </h1>
          
          <div className="flex gap-3">
            {/* join/leave button */}
            <button 
              onClick={handleJoin} 
              className="px-6 py-3 rounded-full font-semibold bg-secondary text-white hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {community.is_member ? 'Leave' : 'Join'}
            </button>
            {/* toggle chat visibility */}
            <button 
              onClick={() => setShowChat(!showChat)} 
              className="px-6 py-3 rounded-full font-semibold glass bg-white text-gray-700 hover:bg-gray-50 transition-all"
            >
              {showChat ? 'Hide Chat' : 'Show Chat'}
            </button>
            {/* Admin controls - only visible to creator */}
            {isAdmin && (editing ? (
              <>
                <button 
                  onClick={handleSave} 
                  className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg"
                >
                  Save
                </button>
                <button 
                  onClick={() => setEditing(false)} 
                  className="px-6 py-3 rounded-full font-semibold glass bg-white text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setEditing(true)} 
                  className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete} 
                  className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all shadow-lg"
                >
                  Delete
                </button>
              </>
            ))}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-8">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Description
              </label>
              {editing ? (
                <textarea 
                  value={formData} 
                  onChange={(e) => setFormData(e.target.value)} 
                  rows={4} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent" 
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {community.description}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Members
                  </label>
                  <span className="text-2xl font-bold text-secondary">
                    {community.members_count || 0}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Created
                  </label>
                  <p className="text-gray-600">
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
              <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-12 text-center">
                <p className="text-gray-600 text-lg mb-6">
                  Join this community to access the chat
                </p>
                <button 
                  onClick={handleJoin} 
                  className="px-8 py-4 bg-secondary text-white rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Join Community
                </button>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Community Info
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span className="ml-2 text-gray-900 font-semibold">
                    {community.is_member ? 'Member' : 'Not a member'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Category:</span>
                  <span className="ml-2 text-gray-900 font-semibold">
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
