import React, { use } from "react";
import { Base_URL } from "../utils/constants";
import axios from "axios";
import { sendEmail } from "../utils/email";
import { connectionRequestEmail } from "../utils/emailTemplates";
import { useSelector } from "react-redux";

const UserCard = ({ feedData, setMoveFeed }) => {
  const [popupMessage, setPopupMessage] = React.useState(null);
  const curUser = useSelector((state) => state.auth.currentUser); 

  const handleLike = async (status) => {
    try {
      const response = await axios.post(
        Base_URL + "/request/send/" + status + "/" + feedData._id,
        {},
        { withCredentials: true }
      );
      console.log("Profile liked:", response.data);
      setPopupMessage("You liked this profile!");
      setTimeout(() => {
        setPopupMessage(null);
        setMoveFeed((prev) => prev + 1);
      }, 1000);
      sendEmail(
        feedData.emailId,
        "Someone wants to connect with you on DevLink! ⚡",
        connectionRequestEmail(feedData.firstName,curUser?.firstName)
      );
    } catch (err) {
      console.error("Error liking profile:", err);
    }
  };

  const handleReject = async (status) => {
    try {
      const response = await axios.post(
        Base_URL + "/request/send/" + status + "/" + feedData._id,
        {},
        { withCredentials: true }
      );
      console.log("Profile liked:", response.data);
      setPopupMessage("You rejected this profile!");
      setTimeout(() => {
        setPopupMessage(null);
        setMoveFeed((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error liking profile:", err);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-3">
      <div className="card bg-base-200 shadow-md rounded-2xl overflow-hidden border border-base-300 hover:shadow-xl transition-all duration-300 min-h-[420px]">
        {/* Profile Image */}
        <figure className="relative h-44 sm:h-52">
          <img
            src={
              feedData?.photoUrl ||
              "https://via.placeholder.com/400x250?text=No+Avatar"
            }
            alt={`${feedData?.firstName || "User"}'s profile`}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Name and Status */}
          <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
            <div className="truncate">
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                {feedData?.firstName && feedData?.lastName
                  ? `${feedData.firstName} ${feedData.lastName}`
                  : "User Name"}
              </h2>
              {feedData?.age && (
                <p className="text-[11px] text-white/80">{feedData.age} yrs</p>
              )}
            </div>
            <span className="badge badge-success badge-xs sm:badge-sm text-white px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </figure>

        {/* Body */}
        <div className="card-body p-3 sm:p-4 space-y-3">
          {/* Description */}
          <div className="h-[70px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent rounded-lg bg-base-100/40 p-2">
            <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
              {feedData?.shortDescription || "No description available."}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-[11px] sm:text-xs text-primary text-center mb-1">
              Skills
            </h3>
            <div className="h-[60px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent rounded-lg bg-base-100/40 p-2 flex flex-wrap justify-center gap-1.5">
              {feedData?.skills?.length > 0 ? (
                feedData.skills.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="badge badge-outline badge-xs border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="opacity-60 text-[11px]">No skills</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleLike("interested")}
              className="btn btn-xs sm:btn-sm flex-1 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.5c0 2.28-1.51 4.04-3 5.5l-6 6-6-6C4.51 12.54 3 10.78 3 8.5A5.5 5.5 0 0 1 8.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 21 8.5Z"
                />
              </svg>
              Like
            </button>
            <button
              onClick={() => handleReject("uninterested")}
              className="btn btn-xs sm:btn-sm flex-1 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white  rounded-lg font-medium"
            >
              ✕ Reject
            </button>
          </div>
        </div>

        {/* Toast */}
        {popupMessage && (
          <div className="toast toast-center toast-top z-50">
            <div
              className={`relative shadow-2xl px-6 py-4 rounded-full flex items-center gap-3 transform transition-all duration-300 ${
                popupMessage.includes("liked")
                  ? "bg-gradient-to-br from-pink-400 via-red-400 to-rose-500 text-white"
                  : "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white"
              } animate-[wiggle_0.5s_ease-in-out]`}
              style={{
                animation: "float 2s ease-in-out infinite",
              }}
            >
              {/* Sparkle effect for like */}
              {popupMessage.includes("liked") && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
              )}

              {/* Icon with pulse effect */}
              <div
                className={`flex-shrink-0 ${
                  popupMessage.includes("liked") ? "animate-pulse" : ""
                }`}
              >
                {popupMessage.includes("liked") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                )}
              </div>

              {/* Message */}
              <span className="font-bold text-base tracking-wide drop-shadow-md">
                {popupMessage}
              </span>

              {/* Bubble tail (optional) */}
              <div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${
                  popupMessage.includes("liked")
                    ? "border-t-rose-500"
                    : "border-t-gray-800"
                }`}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
