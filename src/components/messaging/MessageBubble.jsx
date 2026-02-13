export default function MessageBubble({ message, isOwn, senderName }) {
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const initials = senderName
    ? senderName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
    : 'U';

  return (
    <div className={`flex items-end ${isOwn ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      {!isOwn && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/80 text-gray-800 flex items-center justify-center text-xs font-semibold mr-3">
          {initials}
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
          isOwn
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
        }`}
      >
        {!isOwn && senderName && (
          <p className="text-xs font-bold text-gray-700 mb-1">{senderName}</p>
        )}
        <p className="break-words text-sm">{message.content}</p>
        {formattedTime && (
          <p className="text-xs mt-2 opacity-70 text-right">
            {formattedTime}
          </p>
        )}
      </div>

      {isOwn && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-semibold ml-3">
          {initials}
        </div>
      )}
    </div>
  );
}
