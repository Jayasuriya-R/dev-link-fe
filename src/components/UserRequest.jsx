import React from "react";
import { Base_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../Store/authSlice";
import { updateRequest } from "../Store/requestSlice";
import { sendEmail } from "../utils/email";
import { connectionAcceptedEmail } from "../utils/emailTemplates";

const UserRequest = ({ user }) => {
  const dispatch = useDispatch();
  const acceptedByName = useSelector((state) => state.auth.currentUser?.firstName);
  const dialogId = `modal_${user.fromUserId._id}`;
  const { firstName, lastName, photoUrl, skills, shortDescription, emailId } =
    user.fromUserId;

  const handleRequest = async (status) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.patch(
        `${Base_URL}/request/review/${status}/${user._id}`,
        {},
        { withCredentials: true }
      );
      console.log("Request reviewed:", response.data);
      dispatch(setLoading(false));
      dispatch(updateRequest(user._id));
      if (status === "accepted") {
        sendEmail(emailId, "Your connection request has been accepted! ⚡", connectionAcceptedEmail(firstName,acceptedByName));
      }
    } catch (err) {
      console.log("Error reviewing request:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <div
        className="card bg-purple-100 text-gray-800 w-72 shadow-md p-3"
        onClick={() => document.getElementById(dialogId).showModal()}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-purple-400 ring-offset-base-100 ring-offset-2">
              <img src={photoUrl} alt={firstName} />
            </div>
          </div>

          <h2 className="font-medium text-base text-center truncate w-full">
            {firstName + " " + lastName}
          </h2>

          <p className="text-sm text-gray-600 text-center italic">
            "{firstName} wants to connect and share ideas with you."
          </p>
        </div>
      </div>

      <dialog id={dialogId} className="modal">
        <div className="modal-box bg-purple-100 relative">
          {/* Close button - at the top level of modal-box */}
          <button
            className="btn btn-sm btn-circle absolute right-3 top-3 sm:right-4 sm:top-4 bg-base-300 text-white hover:bg-gray-600 border-none z-50"
            onClick={() => document.getElementById(dialogId)?.close()}
          >
            ✕
          </button>

          <div className="card bg-base-100 image-full shadow-sm">
            <figure>
              <img src={photoUrl} alt="Profile" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{firstName + " " + lastName}</h2>
              <p>{shortDescription || "No description available."}</p>
              <div className="flex flex-wrap gap-4">
                {skills.map((skill) => {
                  return (
                    <button
                      key={skill}
                      className="badge badge-outline border-secondary text-secondary bg-base-100/40 px-3 py-2 text-xs font-medium rounded-full hover:bg-secondary hover:text-white transition-all duration-200"
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action buttons at bottom */}
          <div className="modal-action mt-8">
            <form
              method="dialog"
              className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full"
            >
              <button
                className="btn bg-purple-600 text-white btn-sm hover:bg-purple-500 border-none w-full sm:w-auto"
                onClick={() => handleRequest("accepted")}
              >
                Accept
              </button>
              <button
                className="btn bg-base-300 text-white btn-sm hover:bg-gray-600 border-none w-full sm:w-auto"
                onClick={() => handleRequest("rejected")}
              >
                Deny
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UserRequest;
