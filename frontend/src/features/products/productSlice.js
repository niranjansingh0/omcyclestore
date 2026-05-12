import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI, categoryAPI } from '../../services/api';

const initialState = {
  products: [],
  categories: [],
  currentProduct: null,
  relatedProducts: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0
  },
  filters: {
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 25000,
    sort: 'popularity',
    view: 'grid',
  }
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const response = await productAPI.getProducts(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
  }
});

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (id, { rejectWithValue }) => {
  try {
    const response = await productAPI.getProduct(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
  }
});

export const fetchRelatedProducts = createAsyncThunk('products/fetchRelated', async (id, { rejectWithValue }) => {
  try {
    const response = await productAPI.getRelated(id);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { products: [] };
    }
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch related products');
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await categoryAPI.getCategories();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.relatedProducts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          totalPages: action.payload.pagination?.pages || 1,
          total: action.payload.pagination?.total || 0
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product || null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.products || [];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
      });
  }
});

export const { setFilters, clearFilters, setPage, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
