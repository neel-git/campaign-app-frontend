import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import messageReducer from "./slices/messageSlice";
import practiceReducer from "./slices/practiceSlice";

const store = configureStore({
  reducer: {
    messages: messageReducer,
    auth: authReducer,
    practices: practiceReducer,
  },
});

//for debugging
// store.subscribe(() => {
//   console.log("Store updated:", store.getState());
// });
export { store };
