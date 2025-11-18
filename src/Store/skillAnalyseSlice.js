import { createSlice } from "@reduxjs/toolkit";

const skillAnalysisSlice = createSlice({
    name:"skillAnalysisData",
    initialState:{},
    reducers:{
        addAnalysedData:(state,action)=>{
            return action.payload;
        }
    }
})

export const {addAnalysedData} = skillAnalysisSlice.actions

export default skillAnalysisSlice.reducer;