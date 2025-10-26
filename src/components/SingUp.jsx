import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../Store/authSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Base_URL } from "../utils/constants";

const SingUp = () => {
  const dispatch = useDispatch();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Clean up old preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
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

const handleSignUp = async () => {
  try {
    // ✅ Create FormData instead of regular object
    const formData = new FormData()
    
    // Append all fields
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('emailId', emailId);
    formData.append('password', password);
    formData.append('age', age);
    formData.append('gender', gender);
    formData.append('shortDescription', bio);
    
    // Append skills as JSON string
    formData.append('skills', skills);
    
    // ✅ Append image file - MUST be named 'photo' to match backend
    if (profileImage) {
      formData.append('photo', profileImage);
    }

    const response = await axios.post(
      Base_URL + "/signup",
      formData, // ✅ Send FormData, not regular object
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data' // ✅ Important!
        }
      }
    );
    
    console.log("SignUp successful:", response.data);
    toast.success("SignUp successful!");
    navigate("/feed");
    
  } catch (err) {
    console.log("SignUp error:", err);
    toast.error( "SignUp failed. Please try again.");
  }
};

  return (
    <div className="hero bg-base-200 flex flex-col justify-center w-full min-h-[100vh]">
      <h1 className="text-4xl text-white font-mono font-bold text-center mb-8">
        Welcome to DevLink ⚡
      </h1>

      <div className="hero-content w-full max-w-4xl">
        <div className="card bg-base-100 w-full shadow-2xl">
          <div className="card-body">
            <fieldset className="fieldset">
              {/* Two column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="label">First Name</label>
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
                          value={firstName}
                          placeholder="First Name"
                          pattern="[A-Za-z][A-Za-z0-9\-]*"
                          minlength="3"
                          maxlength="30"
                          title="Only letters, numbers or dash"
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </lable>
                    </fieldset>
                  </div>

                  <div>
                    <label className="label">Last Name</label>
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
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          pattern="[A-Za-z][A-Za-z0-9\-]*"
                          minlength="3"
                          maxlength="30"
                          title="Only letters, numbers or dash"
                        />
                      </lable>
                    </fieldset>
                  </div>

                  <div>
                    <label className="label">Email</label>
                    <fieldset>
                      <label className="input validator">
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
                            <rect
                              width="20"
                              height="16"
                              x="2"
                              y="4"
                              rx="2"
                            ></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </g>
                        </svg>
                        <input
                          type="email"
                          placeholder="mail@site.com"
                          required
                          value={emailId}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                    </fieldset>
                    <div className="validator-hint hidden">
                      Enter valid email address
                    </div>
                  </div>

                  <div>
                    <label className="label">Password</label>
                    <fieldset>
                      <label className="input validator">
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
                            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                            <circle
                              cx="16.5"
                              cy="7.5"
                              r=".5"
                              fill="currentColor"
                            ></circle>
                          </g>
                        </svg>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          minLength="8"
                          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        />
                      </label>
                    </fieldset>
                    <p className="validator-hint hidden text-sm mt-1">
                      Must be more than 8 characters, including
                      <br />
                      At least one number <br />
                      At least one lowercase letter <br />
                      At least one uppercase letter
                    </p>
                  </div>
                  <div>
                    <label className="label">Profile Picture</label>
                    <fieldset>
                      <input
                        type="file"
                        className="file-input"
                        onChange={handleImageChange}
                      />
                    </fieldset>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2 mt-1">
                  <div>
                    <label className="label">Gender</label>
                    <select
                      defaultValue="Gender"
                      className="select w-full"
                      required
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option disabled={true}>Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Tell us about yourself !</label>
                    <textarea
                      className="textarea w-full h-[110px]"
                      placeholder="Bio"
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <label className="label">Age</label>
                    <fieldset>
                      <input
                        type="number"
                        className="input validator w-full"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter age"
                        min="18"
                      />
                      <p className="validator-hint">Must be greater than 18</p>
                    </fieldset>
                  </div>
                  <div>
                    <label className="label">Skills</label>
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
                </div>
              </div>

              {/* Full width button */}
              <button
                className="btn btn-primary mt-6 w-full"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
              <p
                className="text-center font-bold link link-hover mt-2 cursor-pointer"
                onClick={() => dispatch(loginUser())}
              >
                Registered user ? Login
              </p>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingUp;
