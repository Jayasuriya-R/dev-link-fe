import React from "react";
import { useDispatch } from "react-redux";
import { addCurrentUser, setLoading, signUpUser } from "../Store/authSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Base_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    dispatch(setLoading(true));
    try {
      
      const response = await axios.post(
        Base_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Login successful:", response.data);
      toast.success("Login successful!");
      dispatch(addCurrentUser(response.data.data));

      navigate("/feed");
    } catch (err) {
      console.log("Login error:", err);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      <div className="hero bg-base-200 flex flex-col justify-center w-full min-h-[100vh] ">
        <h1 className="text-4xl  text-center text-white font-mono font-bold">
          Welcome to DevLink⚡
        </h1>
        <div className="hero-content flex-col w-full lg:flex-row-reverse">
          <div className="card bg-base-100 md:w-3/12  max-w-xl shrink-0 shadow-2xl">
            <div className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
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
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@site.com"
                    required
                  />
                </label>
                <div className="validator-hint hidden">
                  Enter valid email address
                </div>
                <label className="label">Password</label>
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
                    minlength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                  />
                </label>
                <p className="validator-hint hidden">
                  Must be more than 8 characters, including
                  <br />
                  At least one number <br />
                  At least one lowercase letter <br />
                  At least one uppercase letter
                </p>
                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>
                <button className="btn btn-primary mt-4" onClick={handleLogin}>
                  Login
                </button>
                <p
                  className="text-center font-bold link link-hover mt-2 cursor-pointer"
                  onClick={() => dispatch(signUpUser())}
                >
                  New to devlink ? SingnUp
                </p>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
