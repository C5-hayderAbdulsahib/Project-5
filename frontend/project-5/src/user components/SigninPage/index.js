import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signin } from "../../redux/reducers/auth";
import SignInWithGoogle from "../SignInWithGoogle";

////import for styling //

import "./style.css";

//since we used export directly then when we import we have to add the {} or an error will occur
export const SigninPage = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
    };
  });

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  /////////////////////////login function//

  const signIn = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/users/signIn", {
        email,
        password,
      });

      if (res) {
        setMessage("");

        dispatch(signin(res.data.token));
        navigate("/");
      } else throw Error;
    } catch (error) {
      if (error.response && error.response.data) {
        return setMessage(error.response.data.message);
      }
      setMessage("Error happened while Login, please try again");
    }
  };

  useEffect(() => {
    {
      //this is to redirect the user to the home page if he was already logged in
    }
    if (isLoggedIn) {
      console.log(isLoggedIn);
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="signin-page">
        <div className="position">
          <form className="container">
            <div className="centering-wrapper">
              <div className="section1 text-center">
                <p className="primary-header">Welcome back!</p>
                <p className="secondary-header">
                  We're so excited to see you again!
                </p>
                <div className="input-position">
                  <div className="form-group">
                    <h5 className="input-placeholder">Email</h5>
                    <input
                      type="email"
                      required={true}
                      name="email"
                      className="form-style"
                      autoComplete={"off"}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <h5 className="input-placeholder">Password</h5>
                    <input
                      type="password"
                      required={true}
                      name="logpass"
                      className="form-style"
                      autoComplete={"on"}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <span className="error-message">{message}</span>
                </div>
                <div className="password-container">
                  <Link to={"/signup"} className="link">
                    Need to create a new account?
                  </Link>
                </div>
                <div className="btn-position">
                  <button className="btn" onClick={signIn}>
                    Signin
                  </button>
                  <button className="btn">
                    {" "}
                    <SignInWithGoogle />{" "}
                  </button>
                </div>
              </div>
              <div className="logo-login">
                <div className="logo-container">
                  <img
                    className="logo"
                    src="https://sparkcdnwus2.azureedge.net/sparkimageassets/XPDC2RH70K22MN-08afd558-a61c-4a63-9171-d3f199738e9f"
                  />
                </div>
                <div className="logo-pheader">Discord</div>
                <div className="logo-sheader">
                  <strong>Create an invite-only place where you belong </strong>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
