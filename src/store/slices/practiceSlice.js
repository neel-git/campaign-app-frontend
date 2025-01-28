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
    addPractice: (state, action) => {
      state.practices.push(action.payload);
    },
    updatePractice: (state, action) => {
      const index = state.practices.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.practices[index] = action.payload;
      }
    },
    deletePractice: (state, action) => {
      state.practices = state.practices.filter((p) => p.id !== action.payload);
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

export const { setPractices,addPractice,updatePractice,deletePractice, setLoading, setError } = practiceSlice.actions;
export default practiceSlice.reducer;
