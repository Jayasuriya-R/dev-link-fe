import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="flex gap-3">
      <div className="card bg-primary w-96 shadow-sm">
        <figure>
          <img src={currentUser?.photoUrl} alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            My Profile
            <div className="badge badge-secondary"></div>
          </h2>
          <div className="flex space-x-2 border-b border-base-300 pb-1">
            <span className="font-bold">Email :</span>
            <span>{currentUser.emailId || "-"}</span>
          </div>
          <p>{currentUser.age} years old ✅</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 ">
        <div className="card bg-primary w-96 shadow-sm ">
          <div className="card-body">
            <div className="space-y-4 font-mono">
              <div className="flex space-x-2 border-b border-base-300 pb-1">
                <span className="font-bold">First Name:</span>
                <span>{currentUser.firstName || "-"}</span>
              </div>

              <div className="flex space-x-2 border-b border-base-300 pb-1">
                <span className="font-bold">Last Name:</span>
                <span>{currentUser.lastName || "-"}</span>
              </div>

              <div className="flex space-x-2 border-b border-base-300 pb-1">
                <span className="font-bold">Gender:</span>
                <span>{currentUser.gender || "-"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-300 w-96 shadow-sm flex-1">
          <div className="card-body">
            <div>
            <p>
             {currentUser.shortDescription || "No description available."}
            </p>
            </div>
            <h1 className="text-3xl font-bold">Skills</h1>
            <div className="flex flex-wrap justify-center gap-3"> 
            {currentUser?.skills.map((skill) => (
              <div
                key={skill}
                className="badge badge-primary  p-4 text-sm font-medium hover:scale-110 transition-transform duration-200"
              >
                {skill}
              </div>
            ))}
          </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
