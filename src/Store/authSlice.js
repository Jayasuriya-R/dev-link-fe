import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: true,
        currentUser: null,
        isLoading: false,
        isEditable: false
    },
    reducers: {
        signUpUser:(state)=>{
            state.isLoggedIn= false;
        }
        ,
        loginUser:(state)=>{
            state.isLoggedIn=true;
        },
        addCurrentUser:(state,action)=>{
            state.currentUser=action.payload;
        },
        setLoading:(state,action)=>{
            state.isLoading=action.payload;
        },
        setEditable:(state,action)=>{
            state.isEditable=action.payload;
        }     
    }
})

export const {signUpUser,loginUser,addCurrentUser,setLoading,setEditable} = authSlice.actions;
export default authSlice.reducer;