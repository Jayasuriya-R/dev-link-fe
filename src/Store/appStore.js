import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";
import FeedReducer from "./feedSlice";
import ConnectionReducer from "./connectionSlice";

const appStore = configureStore({
    reducer: {
    auth:AuthReducer,
    feed:FeedReducer,
    connection:ConnectionReducer
  },
})

export default appStore