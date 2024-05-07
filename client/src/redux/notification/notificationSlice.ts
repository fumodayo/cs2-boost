import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Notify } from "../../types";

interface CounterState {
  notification: Notify[];
  loading?: boolean;
  error?: boolean | string;
}

const initialState: CounterState = {
  notification: [],
  loading: false,
  error: false,
};

const notificationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateNotifyStart: (state) => {
      state.loading = true;
    },
    updateNotifySuccess: (state, action: PayloadAction<Notify[]>) => {
      state.notification = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateNotifyFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { updateNotifyStart, updateNotifySuccess, updateNotifyFailure } =
  notificationSlice.actions;

export default notificationSlice.reducer;
