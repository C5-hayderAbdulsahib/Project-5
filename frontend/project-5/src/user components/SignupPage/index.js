//since we used export directly then when we import we have to add the {} or an error will occur

// import style
import "./style.css";

// import component
import { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
//import action
import { signin } from "../../redux/reducers/auth";

export const SignupPage = () => {
  const [email, serEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, serPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const role_id = 1;

  const form = useRef();

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
        country,
        role_id,
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(signin(result.data.token));

           /* emailjs
            .sendForm(
              "service_pkpkbwk",
              "template_tp2jvg8",
              form.current,

              "34ZUguS3f3B0c_oSk"
            )
            .then(
              (result) => {
                console.log(result.text);
              },
              (error) => {
                console.log(error.text);
              }
            ); 
 */
          navigate("/");
        }
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        return setMessage("Error happened while Login, please try again");
      });
  };

  return (
    <>
      <div className="position-signup">
        <form
          className="container-signup"
          ref={form}  
        >
          <div className="centering-wrapper-signup">
            <div className="section1 text-center">
              <p className="primary-header-signup">Create an account</p>
              <div className="input-position-signup">
                <div className="form-group">
                  <h5 className="input-placeholder">Email</h5>
                  <input
                    type="email"
                    required={true}
                    name="user_email"
                    className="form-style-signup"
                    autoComplete={"off"}
                    onChange={(e) => {
                      serEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <h5 className="input-placeholder">Password</h5>
                  <input
                    type="password"
                    required={true}
                    name="logpass"
                    className="form-style-signup"
                    autoComplete={"on"}
                    onChange={(e) => {
                      serPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <h5 className="input-placeholder">User Name</h5>
                  <input
                    type="text"
                    required={true}
                    name="user_name"
                    className="form-style-signup"
                    autoComplete={"off"}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <h5 className="input-placeholder">First Name</h5>
                  <input
                    type="text"
                    required={true}
                    name="logemail"
                    className="form-style-signup"
                    autoComplete={"off"}
                    onChange={(e) => {
                      setFirst_name(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <h5 className="input-placeholder">last name</h5>
                  <input
                    type="text"
                    required={true}
                    name="logemail"
                    className="form-style-signup"
                    autoComplete={"off"}
                    onChange={(e) => {
                      setLast_name(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <h5 className="input-placeholder">country</h5>
                  <input
                    type="text"
                    required={true}
                    name="logemail"
                    className="form-style-signup"
                    autoComplete={"off"}
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="password-container">
                <Link to={"/signin"} className="link">
                  Already have an account?
                </Link>
              </div>
              <div className="btn-position">
                <button
                  className="btn"
                  onClick={(e) => {
                  
                    signup(e);
                  }}
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
