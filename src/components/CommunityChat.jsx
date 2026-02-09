import { useState } from 'react';

// Chat interface for community members
const CommunityChat = ({ communityName }) => {
  // Track message input value
  const [newMessage, setNewMessage] = useState('');

  // Handle message submission
  const handleSend = (e) => {
    e.preventDefault();
    console.log('Message:', newMessage); 
    setNewMessage('');
  };

  return (
    <div className="glass bg-white/40 backdrop-blur-sm rounded-lg shadow-sm h-96 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {communityName} Chat
          </h3>
        </div>
      </div>

      {/* Messages display area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <div className="text-6xl mb-2 opacity-50">👥</div>
          <p>Chat will be available after installing socket.io-client</p>
          <p className="text-xs mt-2">Run: npm install socket.io-client</p>
        </div>
      </div>

      {/* Chat Input Form whre users send and type messages */}
      <form 
        onSubmit={handleSend} 
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            placeholder="Chat coming soon..." 
            disabled
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm" 
          />
        </div>
      </form>
    </div>
  );
};

export default CommunityChat;