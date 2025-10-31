import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";
import FeedReducer from "./feedSlice";
import ConnectionReducer from "./connectionSlice";
import RequestReducer from "./requestSlice";

const appStore = configureStore({
    reducer: {
    auth:AuthReducer,
    feed:FeedReducer,
    connection:ConnectionReducer,
    requests:RequestReducer
  },
})

export default appStore