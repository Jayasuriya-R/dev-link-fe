import React from "react";
import { useSelector } from "react-redux";
const UserCard = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure className="px-10 pt-10">
        <img src={currentUser?.photoUrl} alt="preview" className="rounded-xl w-60 h-50" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">
          {currentUser?.firstName + " " + currentUser?.lastName}
        </h2>
        <p>{currentUser?.shortDescription}</p>
        <div className="p-6 bg-base-200 rounded-2xl shadow-md w-full max-w-md mx-auto">
         

          <div className="flex flex-wrap justify-center gap-3">
            {currentUser?.skills.map((skill) => (
              <div
                key={skill}
                className="badge badge-primary badge-outline p-4 text-sm font-medium hover:scale-110 transition-transform duration-200"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="card-actions">
          <button className="btn btn-primary">Like</button>
          <button className="btn btn-primary">Reject</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
