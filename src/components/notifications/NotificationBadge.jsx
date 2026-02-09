import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import NotificationDropdown from './NotificationDropdown';

const NotificationBadge = ({ userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount(userId);
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead(userId);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors"
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown
          userId={userId}
          onClose={() => setShowDropdown(false)}
          onMarkAllRead={handleMarkAllRead}
          onCountChange={setUnreadCount}
        />
      )}
    </div>
  );
};

export default NotificationBadge;
