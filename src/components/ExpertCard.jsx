import { Link } from 'react-router-dom';

// Expert card component displaying profile information with follow action
const ExpertCard = ({ expert, onFollow }) => {
  // Extract initials from full name for avatar fallback
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex items-start gap-4 mb-4">
        <Link to={`/experts/${expert.id}`}>
          <div className="w-16 h-16 rounded-full border-2 border-primary-200 overflow-hidden bg-primary-100 flex items-center justify-center text-primary-600 font-bold">

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
              className="font-semibold text-gray-900 dark:text-white hover:text-primary-600"
            >
              {expert.name}
            </Link>
            {expert.isVerified && <span className="text-primary-600">✓</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {expert.title}
          </p>
          {expert.location && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
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
            className="px-2 py-1 bg-primary-50 border border-primary-200 text-primary-700 text-xs rounded-full"
          >
            {spec}
          </span>
        ))}
      </div>
      
      {/* Expert statistics */}
      <div className="flex items-center justify-around text-center py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-4">
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {expert.followers}
          </div>
          <div className="text-xs text-gray-500">Followers</div>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {expert.posts}
          </div>
          <div className="text-xs text-gray-500">Posts</div>
        </div>
        {/* conditional rendering to display rating if available */}
        {expert.rating !== undefined && (
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
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
          className="flex-1 px-3 py-2 text-center text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 text-sm font-medium"
        >
          View Profile
        </Link>
         {/* follow button that when triggerd it calls onfollow function with experts id */}
        <button 
          onClick={() => onFollow(expert.id)} 
          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
        >
          {expert.is_following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default ExpertCard;
