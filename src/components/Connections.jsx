import React, { useEffect } from "react";
import { setLoading } from "../Store/authSlice";
import { setConnections } from "../Store/connectionSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Base_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import BlurText from "../UI/BlurText";

const Connections = () => {
  useEffect(() => {
    fetchConnections();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector((state) => state.connection);
  console.log("Connections from store:", connections);
  const fetchConnections = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(Base_URL + "/user/connection", {
        withCredentials: true,
      });
      console.log("Connections fetched:", response.data);
      dispatch(setConnections(response.data.data));
      dispatch(setLoading(false));
    } catch (err) {
      console.log("Error fetching connections:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleMessageClick = (id) => {
    navigate(`/message/${id}`);
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
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-2">
      <h1 className="flex justify-center">
        <BlurText
          text="My Connections"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-3xl font-bold font-mono  mb-4 text-purple-700 tracking-wide"
        />
      </h1>
      <div className="max-w-7xl mx-auto flex flex-col gap-4 ">
        {connections && connections.length > 0 ? (
          connections.map((connection) => {
            return (
              connection && (
                <div
                  key={connection._id}
                  className="bg-purple-100 rounded-lg shadow-md p-3 sm:p-4 lg:p-6 "
                >
                  <div className="flex flex-col gap-3">
                    {/* Top Section: Avatar, Name, Message Button */}
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <img
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                        src={connection.photoUrl}
                        alt={`${connection.firstName} ${connection.lastName}`}
                      />

                      {/* Name and Age/Gender */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold uppercase text-gray-800 truncate">
                          {connection.firstName + " " + connection.lastName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                          {connection.age} • {connection.gender}
                        </p>
                      </div>

                      {/* Message Button */}
                      <button
                        className="btn btn-ghost bg-base-100 btn-sm sm:btn-md btn-circle "
                        aria-label="Send message"
                        onClick={() => handleMessageClick(connection._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Skills Section */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {connection.skills?.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="badge badge-sm sm:badge-md bg-purple-500 text-white border-none text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Description Section */}
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                      {connection.shortDescription ||
                        "No description available."}
                    </p>
                  </div>
                </div>
              )
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">
            <BlurText
              text="No connections found."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-2xl text-center font-bold"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
