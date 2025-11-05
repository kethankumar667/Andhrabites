import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '@/types';

interface RestaurantState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  filters: {
    cuisine: string[];
    vegOnly: boolean;
    sortBy: 'rating' | 'deliveryTime' | 'minOrder';
    searchQuery: string;
  };
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
  filters: {
    cuisine: [],
    vegOnly: false,
    sortBy: 'rating',
    searchQuery: '',
  },
};

export const fetchRestaurants = createAsyncThunk(
  'restaurant/fetchRestaurants',
  async (params?: { location?: string; page?: number; limit?: number }) => {
    // This would be implemented with actual API call
    return { restaurants: [], hasMore: true };
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurant/fetchRestaurantById',
  async (restaurantId: string) => {
    // This would be implemented with actual API call
    return null;
  }
);

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.currentRestaurant = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<RestaurantState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        cuisine: [],
        vegOnly: false,
        sortBy: 'rating',
        searchQuery: '',
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch restaurants
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.restaurants;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch restaurants';
      });

    // Fetch restaurant by ID
    builder
      .addCase(fetchRestaurantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch restaurant';
      });
  },
});

export const { clearError, setCurrentRestaurant, updateFilters, clearFilters } = restaurantSlice.actions;
export default restaurantSlice.reducer;