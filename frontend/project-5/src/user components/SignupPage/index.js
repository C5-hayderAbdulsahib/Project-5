//since we used export directly then when we import we have to add the {} or an error will occur

// import style
import "./style.css";

// import component
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//import action
import { signin } from "../../redux/reducers/auth";

export const SignupPage = () => {
  const [email, serEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, serPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [message, setMessage] = useState("");
  const role_id = 1;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/users/signup`, {
        email,
        password,
        username,
        first_name,
        last_name,
        role_id,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(signin(result.data.token));
          navigate("/");
        }
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Login, please try again");
      });
  };

  return (
    <>
      <h1>this signup</h1>
      <div>
        <form onSubmit={signup}>
          <input
            type={"text"}
            placeholder="Email"
            onChange={(e) => {
              serEmail(e.target.value);
            }}
          />
          <br></br>
          <input
            type={"text"}
            placeholder="User Name"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <br></br>
          <input
            type={"password"}
            placeholder="Password"
            onChange={(e) => {
              serPassword(e.target.value);
            }}
          />
          <br></br>
          <input
            type={"text"}
            placeholder="First Name"
            onChange={(e) => {
              setFirst_name(e.target.value);
            }}
          />
          <br></br>
          <input
            type={"text"}
            placeholder="Last Name"
            onChange={(e) => {
              setLast_name(e.target.value);
            }}
          />
          <br></br>
          <button>Signup</button>
          <br></br>
          {message && <p>{message}</p>}
        </form>
      </div>
    </>
  );
};
