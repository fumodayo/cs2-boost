import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Conversation, Message } from "../../types";

interface CounterState {
  selectedConversation: Conversation | null;
  messages: Message[];
}

const initialState: CounterState = {
  selectedConversation: null,
  messages: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    selectedConversation: (state, action: PayloadAction<Conversation>) => {
      state.selectedConversation = action.payload;
    },
    pushMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { selectedConversation, pushMessages } = conversationSlice.actions;

export default conversationSlice.reducer;
