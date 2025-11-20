import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice";
import FeedReducer from "./feedSlice";
import ConnectionReducer from "./connectionSlice";
import RequestReducer from "./requestSlice";
import aiChatReducer from "./aiChatSlice";
import skillAnalysisReducer from "./skillAnalyseSlice"
import ActionItemReducer from "./actionItemSlice"
import RoadMapReducer from './roadMapSlice'

const appStore = configureStore({
    reducer: {
    auth:AuthReducer,
    feed:FeedReducer,
    connection:ConnectionReducer,
    requests:RequestReducer,
    aiChat:aiChatReducer,
    skillAnalysisData:skillAnalysisReducer,
    actionItem: ActionItemReducer,
    roadMap:RoadMapReducer
  },
})

export default appStore