import api from './api';

// Track if we're in offline mode to reduce unnecessary API calls
let isOffline = false;
let lastOfflineCheck = 0;
const OFFLINE_CHECK_INTERVAL = 60000; // Check every minute if offline

export const notificationService = {
  async getUnreadCount() {
    try {
      // Skip API call if we recently detected we're offline
      const now = Date.now();
      if (isOffline && now - lastOfflineCheck < OFFLINE_CHECK_INTERVAL) {
        return 0;
      }
      
      const response = await api.get('/notifications/unread-count');
      
      // Successful call - we're back online
      if (isOffline) {
        isOffline = false;
        console.log('Notifications service back online');
      }
      
      return response.data.count || 0;
    } catch (error) {
      // Mark as offline if connection refused
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED' || error.message === 'Network Error') {
        if (!isOffline) {
          console.warn('Notifications service offline - suppressing further errors');
          isOffline = true;
        }
        lastOfflineCheck = Date.now();
      } else {
        console.error('Error fetching unread count:', error);
      }
      return 0;
    }
  },

  async getNotifications(page = 1, limit = 10) {
    try {
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        return { notifications: [], total: 0 };
      }
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return null;
    }
  }
};
