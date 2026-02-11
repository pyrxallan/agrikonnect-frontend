import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communitiesService } from '../../services/communitiesService';

// Async thunks for community API operations
export const fetchCommunities = createAsyncThunk('communities/fetchAll', async () => await communitiesService.getCommunities());
export const fetchCommunity = createAsyncThunk('communities/fetchOne', async (id) => await communitiesService.getCommunity(id));
export const joinCommunity = createAsyncThunk('communities/join', async (id) => await communitiesService.joinCommunity(id));
export const leaveCommunity = createAsyncThunk('communities/leave', async (id) => await communitiesService.leaveCommunity(id));

const communitiesSlice = createSlice({
  name: 'communities',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all communities
      .addCase(fetchCommunities.pending, (state) => { state.loading = true; })
      .addCase(fetchCommunities.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchCommunities.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      // Fetch single community
      .addCase(fetchCommunity.fulfilled, (state, action) => { state.current = action.payload; })
      // Join community it updates membership status in both list and current
      .addCase(joinCommunity.fulfilled, (state, action) => {
        const communityId = action.meta.arg;
        const index = state.list.findIndex(c => c.id === communityId);
        if (index !== -1) {
          state.list[index] = { 
            ...state.list[index], 
            is_member: true, 
            members_count: (state.list[index].members_count || 0) + 1 
          };
        }
        if (state.current?.id === communityId) {
          state.current = { 
            ...state.current, 
            is_member: true, 
            members_count: (state.current.members_count || 0) + 1 
          };
        }
      })
      // Leave community it updates membership status in both list and current
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        const communityId = action.meta.arg;
        const index = state.list.findIndex(c => c.id === communityId);
        if (index !== -1) {
          state.list[index] = { 
            ...state.list[index], 
            is_member: false, 
            members_count: Math.max((state.list[index].members_count || 1) - 1, 0) 
          };
        }
        if (state.current?.id === communityId) {
          state.current = { 
            ...state.current, 
            is_member: false, 
            members_count: Math.max((state.current.members_count || 1) - 1, 0) 
          };
        }
      });
  }
});

export default communitiesSlice.reducer;
