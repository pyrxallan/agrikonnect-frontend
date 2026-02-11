import { Link } from 'react-router-dom';

// Reusable card component displaying community information with view action
const CommunityCard = ({ community }) => (
  <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        {/* Display category badge if available */}
        {community.category && (
          <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
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