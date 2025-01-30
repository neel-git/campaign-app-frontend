import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.isLoading = false;
    },
    markAsRead: (state, action) => {
      const message = state.messages.find((m) => m.id === action.payload);
      if (message && !message.is_read) {
        message.is_read = true;
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    setLoading: (state) => {
      state.isLoading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setMessages, markAsRead, deleteMessage, setLoading, setError } =
  messageSlice.actions;
export default messageSlice.reducer;
