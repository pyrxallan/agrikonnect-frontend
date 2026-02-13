import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expertsService } from '../../services/expertsService';

// Async for expert operations
export const fetchExperts = createAsyncThunk('experts/fetchAll', async () => await expertsService.getExperts());
export const fetchExpert = createAsyncThunk('experts/fetchOne', async (id) => await expertsService.getExpert(id));
export const followExpert = createAsyncThunk('experts/follow', async (id) => await expertsService.followExpert(id));
export const unfollowExpert = createAsyncThunk('experts/unfollow', async (id) => await expertsService.unfollowExpert(id));

const expertsSlice = createSlice({
  name: 'experts',
  initialState: { list: [], current: null, loading: false, error: null, followLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all experts
      .addCase(fetchExperts.pending, (state) => { state.loading = true; })
      .addCase(fetchExperts.fulfilled, (state, action) => { 
        state.loading = false; 
        // Handle paginated response
        state.list = action.payload.experts || action.payload; 
      })
      .addCase(fetchExperts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      // Fetch single expert
      .addCase(fetchExpert.pending, (state) => { state.loading = true; })
      .addCase(fetchExpert.fulfilled, (state, action) => { 
        state.loading = false; 
        state.current = action.payload;
        // Also update in list if exists
        const index = state.list.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(fetchExpert.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      // Follow expert
      .addCase(followExpert.pending, (state) => { state.followLoading = true; })
      .addCase(followExpert.fulfilled, (state, action) => {
        state.followLoading = false;
        const expertId = parseInt(action.meta.arg);
        const index = state.list.findIndex(e => e.id === expertId);
        if (index !== -1) {
          state.list[index].is_following = true;
          state.list[index].followers = state.list[index].followers + 1;
        }
        if (state.current?.id === expertId) {
          state.current.is_following = true;
          state.current.followers = state.current.followers + 1;
        }
      })
      .addCase(followExpert.rejected, (state) => { state.followLoading = false; })
      // Unfollow expert
      .addCase(unfollowExpert.pending, (state) => { state.followLoading = true; })
      .addCase(unfollowExpert.fulfilled, (state, action) => {
        state.followLoading = false;
        const expertId = parseInt(action.meta.arg);
        const index = state.list.findIndex(e => e.id === expertId);
        if (index !== -1) {
          state.list[index].is_following = false;
          state.list[index].followers = state.list[index].followers - 1;
        }
        if (state.current?.id === expertId) {
          state.current.is_following = false;
          state.current.followers = state.current.followers - 1;
        }
      })
      .addCase(unfollowExpert.rejected, (state) => { state.followLoading = false; });
  }
});

export default expertsSlice.reducer;
