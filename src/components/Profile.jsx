import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentUser, setEditable, setLoading } from "../Store/authSlice";
import axios from "axios";
import { Base_URL } from "../utils/constants";
import { toast } from "react-hot-toast";

const Profile = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isEditable = useSelector((state) => state.auth.isEditable);
  const [skills, setSkills] = React.useState(currentUser?.skills || []);
  const [skillInput, setSkillInput] = React.useState("");
  const [descriptionInput, setDescriptionInput] = React.useState(
    currentUser?.shortDescription || ""
  );
  const [firstName, setFirstName] = React.useState(currentUser?.firstName || "");
  const [lastName, setLastName] = React.useState(currentUser?.lastName || "");
  const dispatch = useDispatch();

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async () => {
    dispatch(setLoading(true));
    try {
      const updatedProfile = await axios.patch(
        Base_URL + "/profile/edit",
        {
          shortDescription: descriptionInput,
          skills: skills,
          firstName: firstName,
          lastName: lastName
        },
        { withCredentials: true }
      );
      toast.success("Update successful!");
      dispatch(setLoading(false));
      dispatch(setEditable(false));
      dispatch(addCurrentUser(updatedProfile.data.data));
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Error updating profile");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6 p-6 text-base-content">
        {/* Profile Info Card */}
        <div className="card bg-gradient-to-br from-base-300 to-base-200 w-96 shadow-lg border border-base-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <figure className="relative">
            <img
              src={
                currentUser?.photoUrl ||
                "https://via.placeholder.com/400x250?text=No+Avatar"
              }
              alt="Avatar"
              className="object-cover h-56 w-full"
            />
            <div className="absolute bottom-2 left-2 bg-base-100/80 text-sm px-3 py-1 rounded-md">
              {currentUser?.firstName && currentUser?.lastName
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : "User Name"}
              <p>
                {currentUser.age}, {currentUser.gender}
              </p>
            </div>
          </figure>

          <div className="card-body space-y-3">
            <h2 className="card-title text-2xl font-bold text-primary">
              My Profile
            </h2>

            <div className="flex items-center justify-between border-b border-base-200 pb-1">
              <span className="font-bold opacity-80">Email</span>
              <span className="truncate">{currentUser?.emailId || "-"}</span>
            </div>

            <div className="flex items-center justify-between border-b border-base-200 pb-1">
              <span className="font-bold opacity-80">First Name</span>
              { !isEditable ?
                <span>{currentUser?.firstName || "-"}</span>:
                <fieldset>
                      <lable className="input validator">
                        <svg
                          className="h-[1em] opacity-50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </g>
                        </svg>
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          pattern="[A-Za-z][A-Za-z0-9\-]*"
                          minlength="3"
                          value={firstName}
                          maxlength="30"
                          title="Only letters, numbers or dash"
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </lable>
                    </fieldset>}
            </div>
            <div className="flex items-center justify-between border-b border-base-200 pb-1">
              <span className="font-bold opacity-80">Last Name</span>
              {!isEditable ?
                <span>{currentUser?.lastName || "-"}</span>
                :
                <fieldset>
                      <lable className="input validator">
                        <svg
                          className="h-[1em] opacity-50"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </g>
                        </svg>
                        <input
                          type="text"
                          required
                          placeholder="Last Name"
                          value={lastName}
                          pattern="[A-Za-z][A-Za-z0-9\-]*"
                          minlength="3"
                          maxlength="30"
                          title="Only letters, numbers or dash"
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </lable>
                    </fieldset>}
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
              {!isEditable ? (
                <p className="leading-relaxed opacity-90">
                  {currentUser?.shortDescription || "No description available."}
                </p>
              ) : (
                <textarea
                  className="textarea w-full h-[110px]"
                  placeholder="Bio"
                  required
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                ></textarea>
              )}
            </div>
          </div>

          {/* Skills Card */}
          <div className="card bg-gradient-to-br from-primary/20 to-base-300 w-96 shadow-md border border-base-100 hover:shadow-lg transition-all duration-300">
            <div className="card-body space-y-4">
              <h2 className="text-2xl font-bold border-b border-base-200 ">
                Skills
              </h2>
              {!isEditable ? (
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
              ) : (
                <div>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />

                  {/* Display added skills as tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="badge badge-primary gap-2 p-3"
                      >
                        {skill}
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs btn-circle"
                          onClick={() => removeSkill(skill)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-20 flex flex-col gap-2 fixed right-0 m-6">
        {isEditable && (
          <button
            tabIndex={0}
            role="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            Save 💾
          </button>
        )}
        {!isEditable ? (
          <button
            tabIndex={0}
            role="button"
            className="btn btn-primary"
            onClick={() => dispatch(setEditable(true))}
          >
            Edit ✏️
          </button>
        ) : (
          <button
            tabIndex={0}
            role="button"
            className="btn btn-primary"
            onClick={() => dispatch(setEditable(false))}
          >
            Cancel ❌
          </button>
        )}
      </div>
    </>
  );
};

export default Profile;
