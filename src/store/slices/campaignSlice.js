// src/store/slices/campaignSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  isLoading: false,
  error: null,
};

export const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
      state.isLoading = false;
    },
    addCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },
    updateCampaign: (state, action) => {
      const index = state.campaigns.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    deleteCampaign: (state, action) => {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
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

export const {
  setCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  setLoading,
  setError,
} = campaignSlice.actions;

export default campaignSlice.reducer;
