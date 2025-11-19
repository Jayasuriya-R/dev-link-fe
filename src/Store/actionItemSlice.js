import { createSlice } from "@reduxjs/toolkit";

const actionItemSlice = createSlice({
    name:"actionItem",
    initialState:{},
    reducers:{
        addActionItem:(state,action)=>{
            return action.payload
        }
    }
})

export const {addActionItem} = actionItemSlice.actions
export default actionItemSlice.reducer