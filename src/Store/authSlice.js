import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: true,
        currentUser: null,
        profilePreview: null
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
        addProfilePreview:(state,action)=>{
            state.profilePreview=action.payload;
        }     
    }
})

export const {signUpUser,loginUser,addCurrentUser,addProfilePreview} = authSlice.actions;
export default authSlice.reducer;