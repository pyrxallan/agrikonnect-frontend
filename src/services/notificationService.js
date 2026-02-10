import api from './api';

export const notificationService = {
  getNotifications: async (page = 1, unreadOnly = false) => {
    const response = await api.get('/notifications', {
      params: { page, per_page: 20, unread_only: unreadOnly }
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};
