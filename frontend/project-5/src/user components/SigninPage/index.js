import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signin } from "../../redux/reducers/auth";

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
      <canvas className="svgBlob"></canvas>

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
                    name="logemail"
                    className="form-style"
                    autoComplete={"off"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <h5 className="input-placeholder">
                    Password <span className="error-message">{message}</span>
                  </h5>
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
