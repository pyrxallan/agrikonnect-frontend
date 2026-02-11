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
        <h3 className="font-bold text-xl text-gray-900 mb-2 hover:text-secondary transition-colors ">
          {community.name}
        </h3>
      </Link>
      
      <p className="text-gray-600 mb-4 leading-relaxed">
        {community.description}
      </p>
    </div>
    
    <div className="px-6 py-4 ">
      <div className="flex gap-4 text-sm text-gray-600 font-medium mb-4">
        <span>Members {community.members_count || community.members || 0}</span>
      </div>
      
      <Link 
        to={`/communities/${community.id}`} 
        className="block w-full px-4 py-2.5 text-center glass bg-white text-gray-700 rounded-full hover:bg-gray-50 font-semibold transition-all"
      >
        View
      </Link>
    </div>
  </div>
);

export default CommunityCard;