import React from 'react';
import './NotificationBadge.css';

const NotificationBadge = ({ count, onClick }) => {
  // If count is 0, we can either hide it or show nothing.
  if (!count || count === 0) return null;

  return (
    <div className="notification-badge-container" onClick={onClick}>
      <span className="badge-count">
        {count > 99 ? '99+' : count}
      </span>
    </div>
  );
};

export default NotificationBadge;
