import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('omni-wishlist') || '[]');
  } catch {
    return [];
  }
};

const initialState = {
  items: getLocalWishlist(),
  loading: false
};

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    return getLocalWishlist();
  } catch (error) {
    return rejectWithValue('Failed to fetch wishlist');
  }
});

export const toggleWishlistAsync = createAsyncThunk('wishlist/toggle', async (productId, { getState, rejectWithValue }) => {
  try {
    const { wishlist } = getState();
    const exists = wishlist.items.includes(productId);
    const items = exists
      ? wishlist.items.filter((id) => id !== productId)
      : [...wishlist.items, productId];

    localStorage.setItem('omni-wishlist', JSON.stringify(items));
    return { productId, items };
  } catch (error) {
    return rejectWithValue('Failed to update wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const exists = state.items.includes(action.payload);
      state.items = exists ? state.items.filter(id => id !== action.payload) : [...state.items, action.payload];
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter(id => id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
      });
  }
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
