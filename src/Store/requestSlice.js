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
        },
        updateRequest:(state,action) =>{
            const newArray = state.filter((req)=> req._id !== action.payload);
            return newArray;
        }
    }
})

export const {setRequests,removeRequests,updateRequest} = requestSlice.actions;
export default requestSlice.reducer;