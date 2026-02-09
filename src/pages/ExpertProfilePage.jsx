import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expertsService } from '../services/expertsService';

// expert profile page with detailed information and follow functionality
const ExpertProfilePage = () => {
  const { id } = useParams(); // get the expert id from the url
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true); // track the data that is being fetched

  // fetch expert data on mount or when id changes
  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const data = await expertsService.getExpert(id);
        setExpert(data);
      } catch {
        // fallback data if API fails to prevent app from crashing
        setExpert({ 
          id, 
          name: 'Expert Name', 
          title: 'Agricultural Specialist', 
          location: 'Kenya', 
          specialties: ['Farming', 'Agriculture'], 
          followers: 0, 
          posts: 0, 
          rating: '4.5', 
          bio: 'Expert in agricultural practices.', 
          is_following: false 
        });
      } finally {
        setLoading(false); // stop loading spinner
      }
    };
    fetchExpert();
  }, [id]);

  // handles follow/unfollow when button is clicked
  const handleFollow = async () => {
    try {
      await (expert.is_following ? expertsService.unfollowExpert(id) : expertsService.followExpert(id));
      setExpert(prev => ({ ...prev, is_following: !prev.is_following }));
    } catch (err) {
      console.error('Failed to follow/unfollow:', err);
    }
  };

  if (loading) return <div className="min-h-screen relative flex items-center justify-center"><div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/agricultural_expert_page.jpg)' }} /><div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" /><div className="relative z-10 text-gray-600 text-xl">Loading...</div></div>;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/agricultural_expert_page.jpg)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/10" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/experts')} 
          className="flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold mb-6 transition-all"
        >
          ← Back to Experts
        </button>
        
        {/* profile card */}
        <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg p-8">
          {/* header section with avatar and basic info */}
          <div className="flex items-start gap-6 mb-6">
            {/* avatar - shows image or initials */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {expert.avatar_url ? (
                <img 
                  src={expert.avatar_url} 
                  alt={expert.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                // shows initials if no avatar
                expert.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            
            {/* name, title, location, and action buttons */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {expert.name}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                {expert.title}
              </p>
              {/* location that only shows if available */}
              {expert.location && (
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  {expert.location}
                </div>
              )}
              
              {/* follow and message buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleFollow} 
                  className="px-6 py-3 bg-secondary text-white rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg"
                >
                  {expert.is_following ? 'Following' : 'Follow'}
                </button>
                {/* message button for sendig messages */}
                <button className="px-6 py-3 glass bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
                  Message
                </button>
              </div>
            </div>
          </div>
          
          {/* statistics section that shows followers, posts and rating */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {expert.followers}
              </div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {expert.posts}
              </div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {expert.rating}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          {/* specialties section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Specialties
            </h2>
            {/* list of specialty tags */}
            <div className="flex flex-wrap gap-2">
              {(expert.specialties || []).map(spec => (
                <span 
                  key={spec} 
                  className="px-3 py-1 bg-secondary/10 text-secondary rounded-full font-semibold"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          {/* experts biography that only shown if bio exists */}
          {expert.bio && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                About
              </h2>
              <p className="text-gray-600 leading-relaxed">{expert.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;