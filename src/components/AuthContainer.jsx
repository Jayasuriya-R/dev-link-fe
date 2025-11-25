import React from 'react'
import { useSelector } from 'react-redux'
import Login from './Login'
import SingUp from './SingUp'

const AuthContainer = () => {
    const loggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <>
    
   { loggedIn ? <Login /> : <SingUp />}
    </>
  )
}

export default AuthContainer
