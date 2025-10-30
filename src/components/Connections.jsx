import React, { useEffect } from "react";
import { Base_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setConnections } from "../Store/connectionSlice";
import UserRequest from "./UserRequest";

const Connections = () => {
  useEffect(() => {
    fetchConnections();
  }, []);

  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection);
  console.log("Connections from store:", connections);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(Base_URL + "/user/connection", {
        withCredentials: true,
      });
      console.log("Connections fetched:", response.data);
      dispatch(setConnections(response.data.data));
    } catch (err) {
      console.log("Error fetching connections:", err);
    }
  };
  if (!connections) return;
  if (connections.length === 0) {
    return (
      <h1 className="text-2xl font-semibold font-mono text-center mt-4">
        No Connections Found{" "}
      </h1>
    );
  }

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <h1 className="text-2xl font-semibold font-mono text-center mt-4">
          Connections{" "}
        </h1>

        {connections.map((connection) => {
          return connection && <UserRequest key={connection._id} user={connection} />;
        })}
      </div>
    </>
  );
};

export default Connections;
