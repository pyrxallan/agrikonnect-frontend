import { Link } from 'react-router-dom';

// Expert card component displaying profile information with follow action
const ExpertCard = ({ expert, onFollow }) => {
  // Extract initials from full name for avatar fallback
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 p-6">
      <div className="flex items-start gap-4 mb-4">
        <Link to={`/experts/${expert.id}`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">          
            {/* conditional rendering that showsavatar image or initials*/}
            {expert.avatar_url ? (
              <img 
                src={expert.avatar_url} 
                alt={expert.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-lg">{getInitials(expert.name)}</span>
            )}
          </div>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link 
              to={`/experts/${expert.id}`} 
              className="font-semibold text-gray-900 hover:text-secondary transition-colors"
            >
              {expert.name}
            </Link>
            {expert.isVerified && <span className="text-secondary">✓</span>}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {expert.title}
          </p>
          {expert.location && (
            <div className="text-xs text-gray-500 mb-3">
              {expert.location}
            </div>
          )}
        </div>
      </div>
      
      {/* Display up to 3 specialties */}
      <div className="flex flex-wrap gap-1 mb-4">
        {(expert.specialties || []).slice(0, 3).map(spec => (
          <span 
            key={spec} 
            className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full font-semibold"
          >
            {spec}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-around text-center py-4 rounded-2xl mb-4">
        <div>
          <div className="text-lg font-bold text-secondary">
            {expert.followers}
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div>
          <div className="text-lg font-bold text-secondary">
            {expert.posts}
          </div>
          <div className="text-xs text-gray-500">Posts</div>
        </div>
        {/* conditional rendering to display rating if available */}
        {expert.rating !== undefined && (
          <div>
            <div className="text-lg font-bold text-secondary">
              {expert.rating || 0}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        )}
      </div>
      
       {/* Action buttons to view profile and follow */}
      <div className="flex gap-2">
        {/* view profile styled as Link for navigation that takes users to the experts detailed page */}
        <Link 
          to={`/experts/${expert.id}`} 
          className="flex-1 px-3 py-2.5 text-center glass text-gray-700 rounded-full hover:bg-gray-50 font-semibold transition-all"
        >
          View Profile
        </Link>
         {/* follow button that when triggerd it calls onfollow function with experts id */}
        <button 
          onClick={() => onFollow(expert.id)} 
          className="px-4 py-2.5 rounded-full font-semibold bg-secondary text-white hover:bg-secondary/90 transition-all shadow-md hover:shadow-lg"
        >
          {expert.is_following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default ExpertCard;
