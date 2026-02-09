import { useEffect, useState } from "react";
import { fetchInbox } from "../../services/messagesApi";

export default function Inbox({ onSelect, activeUserId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInbox = async () => {
      try {
        setLoading(true);
        const data = await fetchInbox();
        setConversations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load inbox');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, []);

  return (
    <div className="w-1/3 border-r border-white/20 h-full overflow-y-auto bg-gradient-to-b from-primary/5 to-transparent">
      <div className="p-4 border-b border-white/20 sticky top-0 bg-primary/10 backdrop-blur-sm">
        <h2 className="font-bold text-lg text-text">Messages</h2>
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
          No conversations yet
        </div>
      )}

      {conversations.map((conv) => (
        <div
          key={conv.user_id}
          onClick={() => onSelect(conv.user_id)}
          className={`p-4 border-b border-white/10 cursor-pointer transition-all duration-200 ${
            activeUserId === conv.user_id
              ? 'bg-secondary/20 border-l-4 border-l-secondary'
              : 'hover:bg-secondary/10'
          }`}
        >
          <p className="font-medium text-text">{conv.username}</p>
          <p className="text-sm text-gray-600 truncate mt-1">
            {conv.last_message}
          </p>
        </div>
      ))}
    </div>
  );
}
