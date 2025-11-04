import { createSlice } from "@reduxjs/toolkit";

const aiChatSlice = createSlice({
    name: "aiChat",
    initialState:[
    { user: false, text: "How can I assist you today?" },
  ],
  reducers:{
    addMessage:(state,action) =>{
        if(state.length > 30){
            state.splice(0,10)
        }
        state.push(action.payload);
    }
    
  }
})

export const {addMessage} = aiChatSlice.actions;
export default aiChatSlice.reducer;