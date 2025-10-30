import React from "react";

const UserRequest = ({ user }) => {
  return (
    <div className="card bg-purple-200 text-gray-800 w-96 shadow-lg">
      <div className="card-body items-center text-center">
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-purple-400 ring-offset-base-100 ring-offset-2">
            <img src={user.photoUrl} />
          </div>
        </div>
        <h2 className="card-title text-lg font-semibold">
          {user.firstName + " " + user.lastName}
        </h2>
        <div className="card-actions justify-end">
          <button className="btn bg-purple-500 text-white hover:bg-purple-600">
            Accept
          </button>
          <button className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRequest;
