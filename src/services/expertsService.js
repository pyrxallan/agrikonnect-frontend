import api from './api';

// service for handling all expert-related API calls
export const expertsService = {
  // fetch all experts from database
  getExperts: async () => {
    const response = await api.get('/experts');
    return response.data;
  },

  // fetch single expert by ID
  getExpert: async (id) => {
    const response = await api.get(`/experts/${id}`);
    return response.data;
  },

  // follow an expert
  followExpert: async (id) => {
    const response = await api.post(`/experts/${id}/follow`);
    return response.data;
  },

  // unfollow an expert
  unfollowExpert: async (id) => {
    const response = await api.post(`/experts/${id}/unfollow`);
    return response.data;
  },

  // rate an expert with optional review
  rateExpert: async (id, rating, review = '') => {
    const response = await api.post(`/experts/${id}/rate`, { rating, review });
    return response.data;
  }
};
