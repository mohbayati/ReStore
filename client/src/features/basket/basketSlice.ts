import { Basket } from "../../app/models/basket";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";
interface BasketState {
  basket: Basket | null;
  status: string;
}
const initialState: BasketState = {
  basket: null,
  status: "idle",
};

export const fetchBasketItemAsync = createAsyncThunk<Basket>(
  "basket/fetchBasketItemAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Basket.get();
    } catch (error: any) {
      thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!getCookie("buyerId")) return false;
    },
  }
);

export const addBasketItemAsync = createAsyncThunk<
  Basket,
  { productId: number; quantity?: number }
>(
  "basket/addBasketItemAsync",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.addItem(productId, quantity);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>(
  "basket/removeBasketItemAsync",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      return await agent.Basket.removeItem(productId, (quantity = 1));
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    clearBasket: (state) => {
      state.basket = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = "penddingAddItem" + action.meta.arg.productId;
    });

    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status =
        "penddingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      const itemIndex = state.basket?.items.findIndex(
        (i) => i.productId === productId
      );
      if (itemIndex === -1 || itemIndex === undefined) return;
      console.log(quantity);
      state.basket!.items[itemIndex].quantity -= quantity;
      if (state.basket!.items[itemIndex].quantity === 0)
        state.basket?.items.splice(itemIndex, 1);
      state.status = "idle";
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addMatcher(
      isAnyOf(addBasketItemAsync.fulfilled, fetchBasketItemAsync.fulfilled),
      (state, action) => {
        state.basket = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(addBasketItemAsync.rejected, fetchBasketItemAsync.rejected),
      (state, action) => {
        console.log(action.payload);
        state.status = "idle";
      }
    );
  },
});

export const { setBasket, clearBasket } = basketSlice.actions;
