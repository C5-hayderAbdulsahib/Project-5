import React, { useState } from "react";
import axios from "axios";
import { RiCloseLine } from "react-icons/ri";

// import style
import "./CreateNewAdminModel.css";

//import icons
import { BsFillPersonPlusFill } from "react-icons/bs";

const CreateNewAdminModel = (props) => {
  const { setIsOpenAdmin } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

  const createNewAdmin = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/users/signup/superadmin`, {
        email,
        password,
        username,
        first_name,
        last_name,
        country,
      })
      .then((result) => {
        if (result.data.success) {
          setIsOpenAdmin(false);
          setMessage(result.data.message);
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  };

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="CreateNewAdminModel">
        <div className="darkBG" onClick={() => setIsOpenAdmin(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Create A Super Admin</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpenAdmin(false)}>
              <RiCloseLine
                className="exitIcon"
                style={{ marginBottom: "-3px" }}
              />
            </button>

            {/*  <div className="superAdmin"    > */}
            <div className="modalContent">
              {/* ///////////////////////////////the body f the model */}
              You Can Create A New Super Admin
              <div className="push-down"></div>
              <form>
                <input
                  className="admin-input"
                  type={"text"}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br></br>
                <input
                  className="admin-input"
                  type={"password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <input
                  className="admin-input"
                  type={"text"}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <br></br>
                <input
                  className="admin-input"
                  type={"text"}
                  placeholder="First Name"
                  onChange={(e) => setFirst_name(e.target.value)}
                />
                <br></br>
                <input
                  className="admin-input"
                  type={"text"}
                  placeholder="Last Name"
                  onChange={(e) => setLast_name(e.target.value)}
                />

                <br></br>
                <input
                  className="admin-input"
                  type={"text"}
                  placeholder="Country"
                  onChange={(e) => setCountry(e.target.value)}
                />

                {/*         <div className="push-down"></div> */}

                {message && <p className="createAdmin-error">{message}</p>}
                {/* the update button */}
                <div className="shiftingToLeft">
                  <button onClick={createNewAdmin} className="create-admin-Btn">
                    Create New Admin <BsFillPersonPlusFill />
                  </button>

                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => {
                      setIsOpenAdmin(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/*     </div> */}

            {/* // ... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewAdminModel;
