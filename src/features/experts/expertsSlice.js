import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expertsService } from '../../services/expertsService';

// Async for expert operations
export const fetchExperts = createAsyncThunk('experts/fetchAll', async () => await expertsService.getExperts());
export const fetchExpert = createAsyncThunk('experts/fetchOne', async (id) => await expertsService.getExpert(id));
export const followExpert = createAsyncThunk('experts/follow', async (id) => await expertsService.followExpert(id));
export const unfollowExpert = createAsyncThunk('experts/unfollow', async (id) => await expertsService.unfollowExpert(id));

const expertsSlice = createSlice({
  name: 'experts',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all experts
      .addCase(fetchExperts.pending, (state) => { state.loading = true; })
      .addCase(fetchExperts.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchExperts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      // Fetch single expert
      .addCase(fetchExpert.pending, (state) => { state.loading = true; })
      .addCase(fetchExpert.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchExpert.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      // Follow expert
      .addCase(followExpert.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.meta.arg);
        if (index !== -1) state.list[index] = { ...state.list[index], is_following: true };
        if (state.current?.id === action.meta.arg) state.current = { ...state.current, is_following: true };
      })
      // Unfollow expert
      .addCase(unfollowExpert.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.meta.arg);
        if (index !== -1) state.list[index] = { ...state.list[index], is_following: false };
        if (state.current?.id === action.meta.arg) state.current = { ...state.current, is_following: false };
      });
  }
});

export default expertsSlice.reducer;
