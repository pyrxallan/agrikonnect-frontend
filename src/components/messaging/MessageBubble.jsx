export default function MessageBubble({ message, isOwn, senderName }) {
  const formattedTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? "bg-secondary text-white rounded-br-none"
            : "bg-gray-200 text-text rounded-bl-none"
        }}`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-semibold text-gray-700 mb-1">{senderName}</p>
        )}
        <p className="break-words">{message.content}</p>
        {formattedTime && (
          <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-600'}`}>
            {formattedTime}
          </p>
        )}
      </div>
    </div>
  );
}
