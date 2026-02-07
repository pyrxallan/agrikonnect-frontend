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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/experts')} 
          className="flex items-center gap-2 text-green-600 dark:text-green-600 hover:text-green-700 mb-3"
        >
          Back to Experts
        </button>
        
        {/* profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          {/* header section with avatar and basic info */}
          <div className="flex items-start gap-6 mb-6">
            {/* avatar - shows image or initials */}
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-2xl">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {expert.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                {expert.title}
              </p>
              {/* location that only shows if available */}
              {expert.location && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                  {expert.location}
                </div>
              )}
              
              {/* follow and message buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handleFollow} 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  {expert.is_following ? 'Following' : 'Follow'}
                </button>
                {/* message button for sendig messages */}
                <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                   Message
                </button>
              </div>
            </div>
          </div>
          
          {/* statistics section that shows followers, posts and rating */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {expert.followers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {expert.posts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {expert.rating}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
            </div>
          </div>
          
          {/* specialties section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Specialties
            </h2>
            {/* list of specialty tags */}
            <div className="flex flex-wrap gap-2">
              {(expert.specialties || []).map(spec => (
                <span 
                  key={spec} 
                  className="px-3 py-1 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
          
          {/* experts biography that only shown if bio exists */}
          {expert.bio && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                About
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{expert.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;