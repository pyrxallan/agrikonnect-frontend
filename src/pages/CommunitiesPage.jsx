import { useState, useEffect } from 'react';
import CommunityCard from '../components/CommunityCard';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCommunities, joinCommunity, leaveCommunity } from '../features/communities/communitiesSlice';

// Communities page displaying all communities with search, filter, and join functionality
const CommunitiesPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list: communities, loading } = useAppSelector((state) => state.communities);
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch communities on component mount
  useEffect(() => { 
    dispatch(fetchCommunities()); 
  }, [dispatch]);

  // Handle join/leave community action when the button is clicked and it take community id as a parameter
  const handleJoin = (id) => {
    const community = communities.find(c => c.id === id);
    dispatch(community.isJoined ? leaveCommunity(id) : joinCommunity(id));
  };

  // Filter communities by search term and active tab, it also creata a new array containing only communities that matches the criteria
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(search.toLowerCase()) || 
                         community.description.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'my') return matchesSearch && community.isJoined;
    if (activeTab === 'recommended') return matchesSearch && !community.isJoined;
    return matchesSearch;
  });

  // Check if user can create communities (experts and admins only)
  const canCreateCommunity = user?.role === 'expert' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center">
        <div className="text-gray-600 dark:text-gray-400 mt-20">Loading communities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold dark:text-white mb-2">Communities</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join specialized communities to connect with experts and fellow farmers.
              </p>
            </div>
            {canCreateCommunity && (
              <button 
                onClick={() => navigate('/communities/create')} 
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                + Create Community
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <input 
            type="text" 
            placeholder="Search communities..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 py-2 border rounded-lg" 
          />
        </div>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'all' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800'}`}
          >
            All Communities
          </button>
          <button 
            onClick={() => setActiveTab('my')} 
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'my' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800'}`}
          >
            My Communities
          </button>
          <button 
            onClick={() => setActiveTab('recommended')} 
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'recommended' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800'}`}
          >
            Recommended Communities
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard 
              key={community.id} 
              community={community} 
              onJoin={handleJoin} 
            />
          ))}
        </div>
        {/* it shows when no community matches the filter  and it prevent showing a blank page */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No communities found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;
