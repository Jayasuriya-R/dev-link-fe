import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 text-base-content">
  {/* Profile Info Card */}
  <div className="card bg-gradient-to-br from-base-300 to-base-200 w-96 shadow-lg border border-base-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
    <figure className="relative">
      <img
        src={currentUser?.photoUrl || "https://via.placeholder.com/400x250?text=No+Avatar"}
        alt="Avatar"
        className="object-cover h-56 w-full"
      />
      <div className="absolute bottom-2 left-2 bg-base-100/80 text-sm px-3 py-1 rounded-md">
        {currentUser?.firstName && currentUser?.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "User Name"}
      </div>
    </figure>

    <div className="card-body space-y-3">
      <h2 className="card-title text-2xl font-bold text-primary">My Profile</h2>

      <div className="flex items-center justify-between border-b border-base-200 pb-1">
        <span className="font-bold opacity-80">Email</span>
        <span className="truncate">{currentUser?.emailId || "-"}</span>
      </div>

      <div className="flex items-center justify-between border-b border-base-200 pb-1">
        <span className="font-bold opacity-80">Age</span>
        <span>{currentUser?.age ? `${currentUser.age} years` : "-"}</span>
      </div>

      <div className="flex items-center justify-between border-b border-base-200 pb-1">
        <span className="font-bold opacity-80">Gender</span>
        <span>{currentUser?.gender || "-"}</span>
      </div>
    </div>
  </div>

  {/* Right Column */}
  <div className="flex flex-col gap-6">
    {/* About / Description Card */}
    <div className="card bg-base-300 w-96 shadow-md border border-base-100 hover:shadow-lg transition-all duration-300">
      <div className="card-body space-y-4">
        <h2 className="text-2xl font-bold text-primary border-b border-base-200 pb-2">
          About Me
        </h2>
        <p className="leading-relaxed opacity-90">
          {currentUser?.shortDescription || "No description available."}
        </p>
      </div>
    </div>

    {/* Skills Card */}
    <div className="card bg-gradient-to-br from-primary/20 to-base-300 w-96 shadow-md border border-base-100 hover:shadow-lg transition-all duration-300">
      <div className="card-body space-y-4">
        <h2 className="text-2xl font-bold border-b border-base-200 pb-2">
          Skills
        </h2>
        <div className="flex flex-wrap gap-3 justify-start">
          {currentUser?.skills?.length > 0 ? (
            currentUser.skills.map((skill) => (
              <div
                key={skill}
                className="badge border-primary text-primary font-semibold px-4 py-3 text-sm hover:bg-primary hover:text-base-100 transition-all duration-200 cursor-pointer"
              >
                {skill}
              </div>
            ))
          ) : (
            <span className="opacity-70">No skills added.</span>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Profile;
