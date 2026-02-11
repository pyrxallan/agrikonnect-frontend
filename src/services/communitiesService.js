import api from './api';

// service for handling all community-related API calls
export const communitiesService = {
  // fetch all communities from database
  getCommunities: async () => {
    const response = await api.get('/communities');
    return response.data;
  },

  // fetch single community by ID
  getCommunity: async (id) => {
    const response = await api.get(`/communities/${id}`);
    return response.data;
  },

  // create a new community
  createCommunity: async (data) => {
    const response = await api.post('/communities', data);
    return response.data;
  },

  // update community details
  updateCommunity: async (id, data) => {
    const response = await api.put(`/communities/${id}`, data);
    return response.data;
  },

  // delete a community
  deleteCommunity: async (id) => {
    const response = await api.post(`/communities/${id}/delete`);
    return response.data;
  },

  // Join a community
  joinCommunity: async (id) => {
    const response = await api.post(`/communities/${id}/join`);
    return response.data;
  },

  // leave a community
  leaveCommunity: async (id) => {
    const response = await api.delete(`/communities/${id}/join`);
    return response.data;
  }
};