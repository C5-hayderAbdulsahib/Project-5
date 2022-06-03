//since we used export directly then when we import we have to add the {} or an error will occur

// import style
import "./style.css";

// import component
import { useState } from "react";
import axios from "axios";

// create function to signup user

export const SignupPage = () => {
  const [email, serEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, serPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [message, setMessage] = useState("");
  const role_id = 3;

  const signup = (e) => {
    e.preventDefault()
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
          setMessage(result.data.message);
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
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
          <p>{message}</p>
        </form>
      </div>
    </>
  );
};
