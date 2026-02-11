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
  const handleJoin = async (id) => {
    const community = communities.find(c => c.id === id);
    const isMember = community.is_member || community.isJoined;
    await dispatch(isMember ? leaveCommunity(id) : joinCommunity(id));
    // Refetch to ensure UI is in sync
    dispatch(fetchCommunities());
  };

  // Filter communities by search term and active tab, it also creata a new array containing only communities that matches the criteria
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(search.toLowerCase()) || 
                         community.description.toLowerCase().includes(search.toLowerCase());
    const isMember = community.is_member || community.isJoined;
    if (activeTab === 'my') return matchesSearch && isMember;
    if (activeTab === 'recommended') return matchesSearch && !isMember;
    return matchesSearch;
  });

  // Check if user can create communities (experts and admins only)
  const canCreateCommunity = user?.role === 'expert' || user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center">
        <div className="text-gray-600 mt-20">Loading communities...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/farm_page.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Communities</h1>
              <p className="text-xl text-gray-600">
                Join specialized communities to connect with experts and fellow farmers.
              </p>
            </div>
            {canCreateCommunity && (
              <button 
                onClick={() => navigate('/communities/create')} 
                className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                + Create Community
              </button>
            )}
          </div>
        </div>
        
        <div className="glass bg-white/40 rounded-3xl shadow-lg p-6 mb-8">
          <input 
            type="text" 
            placeholder="Search communities..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className=" glass bg-white/40 w-full pl-10 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
          />
        </div>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'all' ? 'bg-secondary text-white shadow-lg' : 'glass bg-white/40 text-gray-700 hover:bg-gray-50'}`}
          >
            All Communities
          </button>
          <button 
            onClick={() => setActiveTab('my')} 
            className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'my' ? 'bg-secondary text-white shadow-lg' : 'glass bg-white/40 text-gray-700 hover:bg-gray-50'}`}
          >
            My Communities
          </button>
          <button 
            onClick={() => setActiveTab('recommended')} 
            className={`px-6 py-3 rounded-full font-semibold transition-all ${activeTab === 'recommended' ? 'bg-secondary text-white shadow-lg' : 'glass bg-white/40 text-gray-700 hover:bg-gray-50'}`}
          >
            Recommended
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard 
              key={community.id} 
              community={community}
            />
          ))}
        </div>
        {/* it shows when no community matches the filter  and it prevent showing a blank page */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">
              No communities found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;
