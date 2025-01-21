// src/store/slices/practiceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const practiceSlice = createSlice({
  name: "practices",
  initialState: {
    practices: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setPractices: (state, action) => {
      state.practices = action.payload;
      state.isLoading = false;
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

export const { setPractices, setLoading, setError } = practiceSlice.actions;
export default practiceSlice.reducer;
