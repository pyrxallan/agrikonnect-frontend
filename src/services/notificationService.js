import axios from 'axios';

const NOTIFICATION_API_URL = import.meta.env.VITE_NOTIFICATION_URL || 'http://localhost:5001/api';

export const notificationService = {
  getNotifications: async (userId, page = 1, unreadOnly = false) => {
    const response = await axios.get(`${NOTIFICATION_API_URL}/notifications/${userId}`, {
      params: { page, per_page: 20, unread_only: unreadOnly }
    });
    return response.data;
  },

  getUnreadCount: async (userId) => {
    const response = await axios.get(`${NOTIFICATION_API_URL}/notifications/${userId}/unread-count`);
    return response.data.count;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.put(`${NOTIFICATION_API_URL}/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (userId) => {
    const response = await axios.put(`${NOTIFICATION_API_URL}/notifications/${userId}/read-all`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await axios.delete(`${NOTIFICATION_API_URL}/notifications/${notificationId}`);
    return response.data;
  },

  clearOldNotifications: async (userId) => {
    const response = await axios.delete(`${NOTIFICATION_API_URL}/notifications/${userId}/clear-old`);
    return response.data;
  }
};
