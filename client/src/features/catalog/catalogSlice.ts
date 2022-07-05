import { Product, ProductParams } from "../../app/models/product";
import {
  createEntityAdapter,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

interface CatalogState {
  productLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
}

const productAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
  "catalog/fetchProductsAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.list();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFilters = createAsyncThunk(
  "catalog/fetchFilters",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
    searchTerm: "",
  };
}

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productAdapter.getInitialState<CatalogState>({
    productLoaded: false,
    status: "idle",
    filtersLoaded: false,
    brands: [],
    types: [],
    productParams: initParams(),
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },
    resetProductParams: (state) => {
      state.productParams = initParams();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export const productsSelector = productAdapter.getSelectors(
  (state: RootState) => state.catalog
);

export const { resetProductParams, setProductParams } = catalogSlice.actions;
