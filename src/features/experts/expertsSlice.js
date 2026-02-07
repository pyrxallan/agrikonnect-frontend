import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { expertsService } from '../../services/expertsService';

// Async function for expert operations
export const fetchExperts = createAsyncThunk('experts/fetchAll', async () => await expertsService.getExperts());
export const fetchExpert = createAsyncThunk('experts/fetchOne', async (id) => await expertsService.getExpert(id));
export const followExpert = createAsyncThunk('experts/follow', async (id) => { await expertsService.followExpert(id); return id; });
export const unfollowExpert = createAsyncThunk('experts/unfollow', async (id) => { await expertsService.unfollowExpert(id); return id; });
export const rateExpert = createAsyncThunk('experts/rate', async ({ id, rating, review }) => {
  const response = await expertsService.rateExpert(id, rating, review);
  return { id, averageRating: response.average_rating };
});

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
      .addCase(fetchExpert.fulfilled, (state, action) => { state.current = action.payload; })
      // Follow expert, and updates follow status and increment follower count
      .addCase(followExpert.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.payload);
        if (index !== -1) state.list[index] = { ...state.list[index], is_following: true, followers: state.list[index].followers + 1 };
        if (state.current?.id === action.payload) state.current = { ...state.current, is_following: true, followers: state.current.followers + 1 };
      })
      // Unfollow expert, and updates follow status and decrement follower count
      .addCase(unfollowExpert.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.payload);
        if (index !== -1) state.list[index] = { ...state.list[index], is_following: false, followers: state.list[index].followers - 1 };
        if (state.current?.id === action.payload) state.current = { ...state.current, is_following: false, followers: state.current.followers - 1 };
      })
      // Rate expert updates average rating in both list and current
      .addCase(rateExpert.fulfilled, (state, action) => {
        const { id, averageRating } = action.payload;
        const index = state.list.findIndex(e => e.id === id);
        if (index !== -1) state.list[index] = { ...state.list[index], rating: averageRating };
        if (state.current?.id === id) state.current = { ...state.current, rating: averageRating };
      });
  }
});

export default expertsSlice.reducer;
