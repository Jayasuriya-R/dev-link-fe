import axios from "axios";
import { Base_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addCurrentUser } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";

export const fetchCurrentUser = async () => {
    const dispatch = useDispatch()
    const naviagate = useNavigate()
  try {
    const response = await axios.get( Base_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addCurrentUser(response.data.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
    naviagate('/login')
  }
};