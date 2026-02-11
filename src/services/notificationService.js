import api from './api';

export const notificationService = {
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  async getNotifications(page = 1, limit = 10) {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};
