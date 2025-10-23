
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Maincontainer from "./components/Maincontainer";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import SingUp from "./components/SingUp";
import { Toaster } from 'react-hot-toast';

function App() {
  
const loggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={loggedIn ?<Login/>:<SingUp/>}/>
      <Route path="/main" element={<Maincontainer/>}>
      
      </Route>
    
    </Routes>
    </BrowserRouter>
     <Toaster position="bottom-right" />
    </>
  );
}

export default App;
