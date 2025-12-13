import React, { useEffect } from "react";
import { Base_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setConnections } from "../Store/connectionSlice";
import UserRequest from "./UserRequest";
import { setLoading } from "../Store/authSlice";
import { setRequests } from "../Store/requestSlice";
import BlurText from "../UI/BlurText";

const Connections = () => {
  useEffect(() => {
    fetchRequests();
  }, []);

  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  

  const fetchRequests = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(Base_URL + "/user/requests/received", {
        withCredentials: true,
      });
     
      dispatch(setRequests(response.data.data));
      dispatch(setLoading(false));
    } catch (err) {
      console.log("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };
  if (!requests) return;
  if (requests.length === 0) {
    return (
      <BlurText
        text=" No Requests Found"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-2xl text-center font-bold mt-8  text-purple-700 tracking-wide"
      />
    );
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold font-mono text-center mt-6 text-purple-700 tracking-wide">
          Connection Requests
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4">
          {requests.map((request) => {
            return request && <UserRequest key={request._id} user={request} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Connections;
