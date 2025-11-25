import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: true,
        currentUser: null,
        isLoading: false,
        isEditable: false,
        isDarkTheme: false,
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
        },
        changeTheme:(state,action) =>{
            state.isDarkTheme=action.payload;
        }     
    }
})

export const {signUpUser,loginUser,addCurrentUser,setLoading,setEditable,changeTheme} = authSlice.actions;
export default authSlice.reducer;