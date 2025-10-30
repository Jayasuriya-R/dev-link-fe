import React from "react";

const UserCard = ({ feedData, setMoveFeed, moveFeed }) => {
  const [popupMessage, setPopupMessage] = React.useState(null);
  const handleLike = () => {
    setPopupMessage("💜 You liked this profile!");
    setTimeout(() => {
      setPopupMessage(null);
      setMoveFeed((prev) => prev + 1);
    }, 1000);
  };

  const handleReject = () => {
    setPopupMessage("❌ You rejected this profile!");
    setTimeout(() => {
      setPopupMessage(null);

      setMoveFeed((prev) => prev + 1);
    }, 1000);
  };

  return (
    <div className="card bg-base-300 w-80 shadow-md rounded-3xl border py-2 border-base-200 transition-all duration-300 hover:shadow-lg">
      {/* Profile Image */}
      <figure className="relative">
        <img
          src={
            feedData?.photoUrl ||
            "https://via.placeholder.com/400x250?text=No+Avatar"
          }
          alt="Profile"
          className="object-cover w-full h-56 rounded-t-3xl hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute flex justify-between items-center bottom-0 w-full bg-gradient-to-t from-base-300/90 to-transparent px-4 py-2 text-left">
          <div>
            <h2 className="text-xl font-bold text-white">
              {feedData?.firstName + " " + feedData?.lastName || "User Name"}
            </h2>
            <p className="text-sm opacity-80">
              {feedData?.age ? `${feedData.age} years old` : ""}
            </p>
          </div>
          <div className="badge badge-outline border-primary text-primary bg-base-100/40 px-3 py-2  font-medium rounded-full ">
            Active
          </div>
        </div>
      </figure>

      {/* Body */}
      <div className="card-body items-center text-center space-y-3 p-4">
        {/* Description */}
        <div className="max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-base-200 rounded-lg p-2 bg-base-200/40 w-full">
          <p className="text-sm leading-relaxed opacity-90">
            {feedData?.shortDescription || "No description available."}
          </p>
        </div>

        {/* Skills */}
        <div className="p-3 bg-base-200/50 rounded-2xl w-full">
          <h3 className="font-semibold mb-2 text-primary text-sm">Skills</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {feedData?.skills?.length > 0 ? (
              feedData.skills.map((skill) => (
                <div
                  key={skill}
                  className="badge badge-outline border-secondary text-secondary bg-base-100/40 px-3 py-2 text-xs font-medium rounded-full hover:bg-secondary hover:text-white transition-all duration-200"
                >
                  {skill}
                </div>
              ))
            ) : (
              <span className="opacity-60 text-xs">No skills added</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between w-full mt-2">
          <button
            className="btn btn-primary btn-outline  w-1/2 mr-1"
            onClick={handleLike}
          >
            ❤️ Like
          </button>
          <button
            className="btn btn-primary btn-outline w-1/2 ml-1"
            onClick={handleReject}
          >
            ❌ Reject
          </button>
        </div>
      </div>
      {popupMessage && (
        <div className="toast toast-center toast-top z-50 animate-fade">
          <div
            className={`alert ${
              popupMessage.includes("liked") ? "alert-success" : "alert-error"
            } shadow-md px-6 py-3 text-base font-medium`}
          >
            <span>{popupMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
