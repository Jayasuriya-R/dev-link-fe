import { createSlice } from "@reduxjs/toolkit";

const roadMapSlice = createSlice({
    name:"roadMap",
    initialState:{},
    reducers:{
      addRoadMap:(state,action) =>{
        return action.payload
      }
    }
})

export const {addRoadMap} = roadMapSlice.actions
export default roadMapSlice.reducer