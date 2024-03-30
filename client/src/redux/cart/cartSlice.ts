import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Order } from "../../types";

interface CounterState {
  currentCart: Order | null;
  loading?: boolean;
  error?: boolean | string;
}

const initialState: CounterState = {
  currentCart: null,
  loading: false,
  error: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartStart: (state) => {
      state.loading = true;
    },
    addCartSuccess: (state, action: PayloadAction<Order>) => {
      state.currentCart = action.payload;
      state.loading = false;
      state.error = false;
    },
    addCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { addCartStart, addCartSuccess, addCartFailure } =
  cartSlice.actions;

export default cartSlice.reducer;
