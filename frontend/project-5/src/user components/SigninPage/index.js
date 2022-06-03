import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../redux/reducers/auth";

////import for styling //

import "./style.css";
//since we used export directly then when we import we have to add the {} or an error will occur

export const SigninPage = () => {
  const dispatch = useDispatch();

  const  {isLoggedIn}  = useSelector((state) => {
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

        dispatch(login(res.data.token));
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
      <div className="signIn">
        <form onSubmit={signIn}>
          <br />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button>Login</button>
        </form>

        {message && <div className="ErrorMessage">{message}</div>}
      </div>
    </>
  );
};
