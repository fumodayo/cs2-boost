import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICurrentUserProps } from "~/types";

interface CounterState {
  theme: string;
  currentUser: ICurrentUserProps | null;
  loading?: boolean;
  error: string | null;
}

const initialState: CounterState = {
  theme: "dark",
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action: PayloadAction<ICurrentUserProps>) => {
      state.currentUser = action.payload;
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
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifySuccess: (state, action: PayloadAction<ICurrentUserProps>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    verifyFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
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
  verifyStart,
  verifySuccess,
  verifyFailure,
  signOut,
} = userSlice.actions;

export default userSlice.reducer;
