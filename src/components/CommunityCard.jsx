import { Link } from 'react-router-dom';

// Reusable card component displaying community information with view and join actions
const CommunityCard = ({ community, onJoin }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl">
          {community.icon}
        </div>
        {/* Display category badge if available */}
        {community.category && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
            {community.category}
          </span>
        )}
      </div>
      {/* Link to community details page */}
      <Link to={`/communities/${community.id}`}>
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 hover:text-primary-600">
          {community.name}
        </h3>
      </Link>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {community.description}
      </p>
    </div>
    
    <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      {/* Member count */}
      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span>Members {community.members}</span>
      </div>
      
      <div className="flex gap-2">
        <Link 
          to={`/communities/${community.id}`} 
          className="flex-1 px-4 py-2 text-center border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 text-sm font-medium"
        >
          View
        </Link>
        {/* button that lets user shows if they have already joined, it runs the onjoin  function and passed the community id*/}
        <button 
          onClick={() => onJoin(community.id)} 
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
        >
           {/* ternary operator that shows "Joined" if user is already a member, otherwise "Join" */}
          {community.isJoined ? 'Joined' : 'Join'}
        </button>
      </div>
    </div>
  </div>
);

export default CommunityCard;