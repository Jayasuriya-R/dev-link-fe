import { BrowserRouter, Route, Routes } from "react-router-dom";
import Maincontainer from "./components/Maincontainer";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import SingUp from "./components/SingUp";
import { Toaster } from "react-hot-toast";
import UserCard from "./components/UserCard";
import AuthContainer from "./components/AuthContainer";
import Profile from "./components/Profile";
import FeedContainer from "./components/FeedContainer";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Maincontainer />}>
            <Route path="login" element={<AuthContainer />} />
            <Route path="feed" element={<FeedContainer/>} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
