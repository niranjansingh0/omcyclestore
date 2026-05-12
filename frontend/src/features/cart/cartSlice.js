import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';
import { isAuthenticated } from '../../utils/auth';

const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem('omni-cart') || '[]');
  } catch {
    return [];
  }
};

const normalizeCartItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.cart?.items)) {
    return payload.cart.items.map((item) => ({
      id: item._id,
      productId: item.product?._id || item.product,
      quantity: item.quantity,
      price: item.price,
      name: item.product?.name,
      image:
        typeof item.product?.images?.[0] === 'string'
          ? item.product.images[0]
          : item.product?.images?.[0]?.url
    }));
  }
  return [];
};

const calculateTotals = (items) => ({
  totalItems: Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : 0,
  totalPrice: Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity * item.price, 0) : 0,
});

const initialState = {
  items: getLocalCart(),
  ...calculateTotals(getLocalCart()),
  loading: false
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  if (!isAuthenticated()) return getLocalCart();
  try {
    const response = await cartAPI.getCart();
    return normalizeCartItems(response.data);
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
  }
});

export const addToCartAsync = createAsyncThunk('cart/addToCart', async (product, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    const localCart = getLocalCart();
    const existing = localCart.find(item => item.productId === product.productId);
    if (existing) existing.quantity += product.quantity || 1;
    else localCart.push({ ...product, quantity: product.quantity || 1 });
    localStorage.setItem('omni-cart', JSON.stringify(localCart));
    return localCart;
  }
  try {
    const response = await cartAPI.addToCart({
      product: product.productId,
      quantity: product.quantity || 1
    });
    return normalizeCartItems(response.data);
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to add to cart');
  }
});

export const updateCartItemAsync = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    const localCart = getLocalCart();
    const item = localCart.find(i => i.id === itemId);
    if (item) {
      if (quantity <= 0) return localCart.filter(i => i.id !== itemId);
      item.quantity = quantity;
    }
    localStorage.setItem('omni-cart', JSON.stringify(localCart));
    return localCart;
  }
  try {
    const response = await cartAPI.updateCartItem(itemId, quantity);
    return normalizeCartItems(response.data);
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update cart');
  }
});

export const removeFromCartAsync = createAsyncThunk('cart/removeItem', async (itemId, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    const localCart = getLocalCart().filter(i => i.id !== itemId);
    localStorage.setItem('omni-cart', JSON.stringify(localCart));
    return localCart;
  }
  try {
    const response = await cartAPI.removeFromCart(itemId);
    return normalizeCartItems(response.data);
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to remove from cart');
  }
});

export const clearCartAsync = createAsyncThunk('cart/clearCart', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    localStorage.removeItem('omni-cart');
    return [];
  }
  try {
    await cartAPI.clearCart();
    return [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) existingItem.quantity += action.payload.quantity || 1;
      else state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      Object.assign(state, calculateTotals(state.items));
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.productId !== action.payload);
      Object.assign(state, calculateTotals(state.items));
    },
    updateQuantity(state, action) {
      const item = state.items.find(entry => entry.productId === action.payload.productId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      Object.assign(state, calculateTotals(state.items));
    },
    clearCart(state) {
      state.items = [];
      Object.assign(state, calculateTotals(state.items));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        Object.assign(state, calculateTotals(action.payload));
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        Object.assign(state, calculateTotals(action.payload));
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        Object.assign(state, calculateTotals(action.payload));
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        Object.assign(state, calculateTotals(action.payload));
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        Object.assign(state, calculateTotals([]));
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
