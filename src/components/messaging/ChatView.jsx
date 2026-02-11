import { useEffect, useState } from "react";
import { fetchConversation, sendMessage } from "../../services/messagesApi";
import MessageBubble from "./MessageBubble";

export default function ChatView({ userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const data = await fetchConversation(userId);
        if (isMounted) {
          setMessages(data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load conversation');
          setMessages([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMessages();

    const interval = setInterval(loadMessages, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setSending(true);
      await sendMessage(userId, text);
      setText("");
      setError(null);
      // Reload messages after sending
      const data = await fetchConversation(userId);
      setMessages(data);
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 to-transparent">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-secondary/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-600">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-background to-white">
      {error && (
        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.is_own}
              senderName={msg.sender_name}
            />
          ))
        )}
      </div>

      <div className="p-6 border-t border-white/20 bg-white/50 backdrop-blur-sm">
        <div className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1 border border-secondary/30 rounded-full px-4 py-3 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 bg-white transition-all"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
