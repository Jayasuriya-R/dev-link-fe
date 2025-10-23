import { createSlice, current } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: true,
        currentUser: null,
    },
    reducers: {
        signUpUser:(state)=>{
            state.isLoggedIn= false;
        }
        ,
        loginUser:(state)=>{
            state.isLoggedIn=true;
        }
    }
})

export const {signUpUser,loginUser} = authSlice.actions;
export default authSlice.reducer;