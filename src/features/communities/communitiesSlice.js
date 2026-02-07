import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { communitiesService } from '../../services/communitiesService';

// Async function for community operations
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
        const { community } = action.payload;
        if (community) {
          const index = state.list.findIndex(c => c.id === community.id);
          if (index !== -1) state.list[index] = { ...state.list[index], isJoined: true, members: community.members };
          if (state.current?.id === community.id) state.current = { ...state.current, is_member: true, members_count: community.members };
        }
      })
      // Leave community it updates membership status in both list and current
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        const { community } = action.payload;
        if (community) {
          const index = state.list.findIndex(c => c.id === community.id);
          if (index !== -1) state.list[index] = { ...state.list[index], isJoined: false, members: community.members };
          if (state.current?.id === community.id) state.current = { ...state.current, is_member: false, members_count: community.members };
        }
      });
  }
});

export default communitiesSlice.reducer;
