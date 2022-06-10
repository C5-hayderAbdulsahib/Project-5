// import axios
import axios from "axios";

// import hooks
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

// import action
import { useSelector } from "react-redux";

// import style.css
import "./UpdatePasswordModal.css";

const UpdatePasswordModal = (props) => {
  //=============================================================================================================
  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  //=============================================================================================================

  const { setIsOpen } = props;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState(false);

  //=============================================================================================================

  const changePassword = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/users/change_password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setCorrect(true);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  //=============================================================================================================

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="CreateCategoryModalUpdate">
        <div className="darkBG" onClick={() => setIsOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Update Password</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>

            <div className="modalContent">
              <div className="fixed-width">
                {/* ///////////////////////////////the body f the model */}
                You can Update Password
                <div className="push-down"></div>{" "}
                <div className="Category-label">
                  {" "}
                  <label>Update Password</label>
                </div>
                <input
                  className="Create-Category"
                  type={"password"}
                  placeholder="Old Password"
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <br></br>
                <input
                  className="Create-Category"
                  type={"password"}
                  placeholder="New Password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <br></br>
                <input
                  className="Create-Category"
                  type={"password"}
                  placeholder="Confirm Password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                {/* the update button */}
                <div className="shiftingToLeft">
                  {/* 
<div className="shiftingToLeft"> */}
                  <button
                    // onClick={() => {
                    //   updateCategoryFun(id);
                    //   setIsOpen(false);
                    // }}
                    className="createBtn"
                    onClick={() => {
                      changePassword();
                    }}
                  >
                    Update Password
                  </button>

                  {/*  </div> */}
                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {correct ? (
                  <p className="CorrectMessage">{message}</p>
                ) : (
                  <p className="errMessage">{message}</p>
                )}
              </div>
            </div>
            {/* // ... */}
          </div>
        </div>
      </div>
    </>
  );
};


export default UpdatePasswordModal