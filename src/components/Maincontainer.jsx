import { useEffect } from "react";
import { addCurrentUser } from "../Store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_URL } from "../utils/constants";
import Body from "./Body";
import Login from "./Login";
import AuthContainer from "./AuthContainer";

const Maincontainer = () => {
  const disptach = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isLoading = useSelector((state) => state.auth.isLoading);

  useEffect(() => {
    fetchCurrentUser();
  }, []);
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(Base_URL + "/profile/view", {
        withCredentials: true,
      });
      disptach(addCurrentUser(response.data.data));
      navigate("/feed");
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  return (
   <>
  {isLoading && (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-8 flex flex-col items-center shadow-xl">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </div>
  )}
  {currentUser ? <Body /> : <AuthContainer/>}
</>
  )
};

export default Maincontainer;
