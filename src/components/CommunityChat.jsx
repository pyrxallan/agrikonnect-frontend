import { useState, useEffect } from 'react';
import api from '../services/api';

// Chat interface for community members
const CommunityChat = ({ communityName, communityId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/communities/${communityId}/messages`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (communityId) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [communityId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/communities/${communityId}/messages`, {
        content: newMessage
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          {communityName} Chat
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="glass bg-white/30 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">{msg.author?.name || 'User'}</span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-700">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200/50">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Type a message..." 
            disabled={loading}
            className="flex-1 px-4 py-2.5 glass bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" 
          />
          <button 
            type="submit" 
            disabled={loading || !newMessage.trim()}
            className="px-6 py-2.5 bg-secondary text-white rounded-full text-sm font-semibold hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityChat;