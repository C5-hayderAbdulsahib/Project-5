//import packages
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import useDispatch and useSelector to dispatch and subscribe to the store
import { useDispatch, useSelector } from "react-redux";

// import the actions
import { signin } from "../../redux/reducers/auth";

//import styling
import "./style.css";

const SuperSigninPage = () => {
  // useDispatch allows us to dispatch actions to the reducers
  const dispatch = useDispatch(); //we need to make an instance of the dispatch

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  // useSelector gives us access to the store
  const state = useSelector((state) => {
    // specify which state to subscribe to (state tree => reducer => state name )
    //the state inside the parameter refer to the store in the store.js and it will have all of it reducers and then we will access the wanted reducer and after that we want to access the wanted state inside that reducer
    return {
      isLoggedIn: state.auth.isLoggedIn, //state.auth.isLoggedIn ---> the first state is built in and it came from the function parameter the second auth is the name that we give to the reducer inside the store and the isLoggedIn is the name of the state itself and we give it this name inside the reducer file
    };
  });

  // use the `useNavigate` hook in the component to gain access to the instance that is used to navigate
  const navigate = useNavigate();

  useEffect(() => {
    {
      //this is to redirect the user to the home page if he was already logged in
    }
    if (state.isLoggedIn) {
      navigate("/super_admin/home");
    }
  }, []);

  const loginFun = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/users/signin", {
        // the data that is entered in the object that is dent using axios must have the same key name as the name in postman(the same field name in the DB) or an error will occur

        email, //this is the same as email: email
        password, //the key has to be the same key in the backend
      })
      .then((result) => {
        dispatch(signin(result.data.token));
        navigate("/super_admin/home"); //we used the navigate in order to change the path to / automatically without the user need to enter it in the browser url field
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.message);
      });
  };

  return (
    <>
      <div className="positionS">
        <br />

        <form className="containerS" onSubmit={loginFun}>
          <div className="centering-wrapperS">
            <div className="section1S text-center">
              <div className="input-positionS">
                <div className="form-groupS">
                  <h5 className="input-placeholderS">Email</h5>
                  <input
                    className="form-styleS"
                    type={"email"}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-groupS">
                  <h5 className="input-placeholderS">Password</h5>
                  <input
                    className="form-styleS"
                    type={"password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

              </div>
              <span className="error-message">{message}</span>
              <br></br>
              <div className="btn-positionS">
                <button className="btnS">Signin</button>
              </div>
           
            </div>

            <div className="logo-loginS">
              <div className="logo-containerS">
                <img
                  className="logoS"
                  src="https://sparkcdnwus2.azureedge.net/sparkimageassets/XPDC2RH70K22MN-08afd558-a61c-4a63-9171-d3f199738e9f
                  "
                />
                <canvas className="logo-codeS"></canvas>
              </div>
              <div className="logo-pheaderS"> Manger</div>
              <div className="logo-sheaderS">
                <strong>You can mange your system here </strong>
              </div>
            </div>
          </div>
        {/*   {message ? <p className="login-err">{message}</p> : ""} */}
        </form>

     
      </div>
    </>
  );
};

export default SuperSigninPage; //if we use export default then when we import we dont use {} or an error will appear
