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
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import TechNews from "./components/TechNews";
import Messaging from "./components/Messaging";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Maincontainer />}>
            <Route path="login" element={<AuthContainer />} />
            <Route path="feed" element={<FeedContainer/>} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections/>} />
            <Route path="requests" element={<Requests/>} />
            <Route path="message" element={<Messaging/>} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
