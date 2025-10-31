import React, { useEffect } from "react";
import { Base_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setConnections } from "../Store/connectionSlice";
import UserRequest from "./UserRequest";
import { setLoading } from "../Store/authSlice";
import { setRequests } from "../Store/requestSlice";

const Connections = () => {
  useEffect(() => {
    fetchRequests();
  }, []);

  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  console.log("Connections from store:", requests);

  const fetchRequests = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(Base_URL + "/user/requests/received", {
        withCredentials: true,
      });
      console.log("Connections fetched:", response.data);
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
      <h1 className="text-2xl font-semibold font-mono text-center mt-4">
        No Connections Found{" "}
      </h1>
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
            return (
              request && (
                <UserRequest
                  key={request._id}
                  user={request}
                />
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Connections;
