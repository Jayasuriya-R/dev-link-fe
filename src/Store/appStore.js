import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";
import FeedReducer from "./feedSlice";
import ConnectionReducer from "./connectionSlice";
import RequestReducer from "./requestSlice";
import aiChatReducer from "./aiChatSlice";
import skillAnalysisReducer from "./skillAnalyseSlice"

const appStore = configureStore({
    reducer: {
    auth:AuthReducer,
    feed:FeedReducer,
    connection:ConnectionReducer,
    requests:RequestReducer,
    aiChat:aiChatReducer,
    skillAnalysisData:skillAnalysisReducer,
  },
})

export default appStore