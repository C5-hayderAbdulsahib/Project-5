import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signin } from "../../redux/reducers/auth";
import "./style.css";

const SignInWithGoogle = () => {
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    console.log(response);

    axios
      .post(`http://localhost:5000/users/signin_google`, {
        email: response.profileObj.email,
        username: response.profileObj.givenName,
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName,
        profile_image: response.profileObj.imageUrl,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(signin(result.data.token));

          navigate("/");
        }
      })
      .catch((err) => {
        if (!err.response.data.success) {
          console.log(err);
          return setMessage(err.response.data.message);
        }
        return setMessage("Error happened while Login, please try again");
      });
  };

  const clientId =
    "171142303177-dlklu0me533t11g37ll28pjmd603vh8c.apps.googleusercontent.com";

  return (
    <>
      <GoogleLogin
        clientId={clientId}
        render={(renderProps) => (
          <button
            className="btn"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <FcGoogle className="googleIcon" />
            Signin with google
          </button>
        )}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </>
  );
};

export default SignInWithGoogle;
