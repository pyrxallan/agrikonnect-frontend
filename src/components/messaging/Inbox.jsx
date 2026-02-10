import { useEffect, useState } from "react";
import { fetchInbox } from "../../services/messagesApi";

export default function Inbox({ onSelect, activeUserId, onNewChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInbox = async () => {
      try {
        setLoading(true);
        const data = await fetchInbox();
        setConversations(data || []);
        setError(null);
      } catch (err) {
        console.error('Inbox error:', err);
        setError('Failed to load inbox');
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, []);

  return (
    <div className="w-1/3 border-r border-white/20 h-full overflow-y-auto bg-gradient-to-b from-primary/5 to-transparent">
      <div className="p-4 border-b border-white/20 sticky top-0 bg-primary/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text">Messages</h2>
          <button
            onClick={onNewChat}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/90 text-white transition-all hover:scale-105"
            title="New conversation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 m-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-sm">Loading messages...</p>
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="p-8 text-center text-gray-500 text-sm">
          <p>No conversations yet.</p>
          <p className="mt-2">Click the + button to start chatting!</p>
        </div>
      )}

      {!loading && conversations.length > 0 && conversations.map((conv) => {
        const initials = conv.first_name?.charAt(0).toUpperCase() + (conv.last_name?.charAt(0).toUpperCase() || '');
        
        return (
          <div
            key={conv.user_id}
            onClick={() => onSelect(conv.user_id)}
            className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 ${
              activeUserId === conv.user_id
                ? 'bg-secondary/20 border-l-4 border-l-secondary'
                : 'hover:bg-secondary/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {conv.profile_image ? (
                  <img
                    src={conv.profile_image}
                    alt={conv.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                )}
                {/* Online status indicator - optional */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text truncate">{conv.username}</p>
                  {conv.role && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                      conv.role === 'expert'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-secondary/20 text-secondary'
                    }`}>
                      {conv.role}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {conv.last_message}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
