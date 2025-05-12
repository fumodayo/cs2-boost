import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICurrentUserProps } from "~/types";

interface CounterState {
  theme: string;
  currentAdmin: ICurrentUserProps | null;
  loading?: boolean;
  error: string | null;
}

const initialState: CounterState = {
  theme: "dark",
  currentAdmin: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<ICurrentUserProps>) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatedStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action: PayloadAction<ICurrentUserProps>) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  updatedStart,
  updateSuccess,
  updateFailure,
  signOut,
} = adminSlice.actions;

export default adminSlice.reducer;
