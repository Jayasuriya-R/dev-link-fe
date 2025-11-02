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
  const [firstName, setFirstName] = React.useState(
    currentUser?.firstName || ""
  );
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
          lastName: lastName,
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
      <div className="flex flex-wrap justify-center gap-8 p-6 text-base-content">
        {/* Profile Info Card */}
        <div className="card bg-gradient-to-br from-base-300 to-base-200 w-96 h-[500px] shadow-xl border border-base-100 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
          <figure className="relative flex-shrink-0">
            <img
              src={
                currentUser?.photoUrl ||
                "https://via.placeholder.com/400x250?text=No+Avatar"
              }
              alt="Avatar"
              className="object-cover h-44 w-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-bold text-xl truncate">
                {currentUser?.firstName && currentUser?.lastName
                  ? `${currentUser.firstName} ${currentUser.lastName}`
                  : "User Name"}
              </h3>
              <p className="text-white/90 text-sm">
                {currentUser?.age
                  ? `${currentUser.age}, ${currentUser.gender}`
                  : "-"}
              </p>
            </div>
          </figure>

          <div className="card-body space-y-3 flex-1 overflow-y-auto">
            <h2 className="card-title text-xl font-bold text-primary sticky top-0 bg-gradient-to-br from-base-300 to-base-200 pb-2 -mx-2 px-2 z-10">
              My Profile
            </h2>

            {[
              { label: "Email", value: currentUser?.emailId },
              { label: "First Name", value: currentUser?.firstName },
              { label: "Last Name", value: currentUser?.lastName },
            ].map((field, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-base-200 pb-2"
              >
                <span className="font-semibold opacity-70 text-sm">
                  {field.label}
                </span>
                {!isEditable || field.label === "Email" ? (
                  <span className="text-sm ml-2 truncate">
                    {field.value || "-"}
                  </span>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder={field.label}
                    value={field.label === "First Name" ? firstName : lastName}
                    onChange={(e) =>
                      field.label === "First Name"
                        ? setFirstName(e.target.value)
                        : setLastName(e.target.value)
                    }
                    className="input input-sm w-40 ml-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* About / Bio Card */}
          <div className="card bg-base-300 w-96 h-[260px] shadow-lg border border-base-100 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="card-body space-y-3 flex flex-col overflow-hidden">
              <h2 className="text-xl font-bold text-primary border-b border-base-200 pb-2 flex-shrink-0">
                About Me
              </h2>
              {!isEditable ? (
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-base-200">
                  <p className="leading-relaxed opacity-90 text-sm whitespace-pre-wrap">
                    {currentUser?.shortDescription ||
                      "No description available."}
                  </p>
                </div>
              ) : (
                <textarea
                  className="textarea textarea-bordered w-full flex-1 resize-none overflow-y-auto"
                  placeholder="Write something about yourself..."
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                ></textarea>
              )}
            </div>
          </div>

          {/* Skills Card */}
          <div className="card bg-gradient-to-br from-primary/20 to-base-300 w-96 h-[210px] shadow-lg border border-base-100 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="card-body space-y-3 flex flex-col overflow-hidden">
              <h2 className="text-xl font-bold text-primary border-b border-base-200 pb-2 flex-shrink-0">
                Skills
              </h2>
              {!isEditable ? (
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-base-200">
                  <div className="flex flex-wrap gap-2 justify-start">
                    {currentUser?.skills?.length > 0 ? (
                      currentUser.skills.map((skill) => (
                        <div
                          key={skill}
                          className="badge border-primary text-primary font-semibold px-3 py-2 text-xs hover:bg-primary hover:text-base-100 transition-all duration-200 cursor-pointer"
                        >
                          {skill}
                        </div>
                      ))
                    ) : (
                      <span className="opacity-70 text-sm">
                        No skills added.
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <input
                    type="text"
                    required
                    className="input input-sm w-full flex-shrink-0"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />
                  <div className="flex flex-wrap gap-2 mt-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-base-200">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="badge badge-primary gap-2 p-2 h-fit"
                      >
                        <span className="text-xs">{skill}</span>
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

      {/* Floating Action Buttons */}
      <div className="fixed bottom-25 right-10 flex flex-col gap-3">
        {isEditable ? (
          <>
            <button className="btn btn-primary" onClick={handleSave}>
              Save 💾
            </button>
            <button
              className="btn btn-neutral"
              onClick={() => dispatch(setEditable(false))}
            >
              Cancel ❌
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => dispatch(setEditable(true))}
          >
            Edit ✏️
          </button>
        )}
      </div>
    </>
  );
};

export default Profile;
