import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import messageReducer from "./slices/messageSlice";
import practiceReducer from "./slices/practiceSlice";
import campaignReducer from "./slices/campaignSlice";

const store = configureStore({
  reducer: {
    messages: messageReducer,
    auth: authReducer,
    practices: practiceReducer,
    campaigns: campaignReducer,
  },
});

//for debugging
// store.subscribe(() => {
//   console.log("Store updated:", store.getState());
// });
export { store };
