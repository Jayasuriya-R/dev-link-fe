import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name:"requests",
    initialState:[],
    reducers:{
        setRequests:(state,action)=>{
            return action.payload;
        },
        removeRequests:(state)=>{
            state.requests=[];
        }
    }
})

export const {setRequests,removeRequests} = requestSlice.actions;
export default requestSlice.reducer;