import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";

const appStore = configureStore({
    reducer: {
    auth:AuthReducer,
  },
})

export default appStore