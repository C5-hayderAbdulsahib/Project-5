// import hooks
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import from store
import { useSelector, useDispatch } from "react-redux";

//import actions
import { getUserInfo, updateUserInfo } from "../../redux/reducers/user";

//import Model
import UpdatePasswordModal from "./UpdatePasswordModal";

// import style
import "./style.css";

const AccountPage = () => {
  const { token, user } = useSelector((state) => {
    return { token: state.auth.token, user: state.user.user };
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [info, setInfo] = useState("");
  const [email, setEmail] = useState(user.email);
  const [first_name, setFirst_name] = useState(user.first_name);
  const [last_name, setLast_name] = useState(user.last_name);
  const [country, setCountry] = useState(user.country);
  const [profile_image, setProfile_image] = useState(user.profile_image);
  const [imgUrl, setImgUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  /*
  const getUserInfoFunc = () => {
    axios
      .get(`http://localhost:5000/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setInfo(result.data.user[0]);
        dispatch(getUserInfo(result.data.user[0]));
      });
  };
*/
  const updateUserInfoFun = () => {
    axios
      .put(
        `http://localhost:5000/users/change_info`,
        {
          email,
          first_name,
          last_name,
          country,
          profile_image: imgUrl || user.profile_image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(
          updateUserInfo({
            ...user,
            email,
            first_name,
            last_name,
            country,
            profile_image: imgUrl || user.profile_image,
          })
        );
        setMessage(`update information`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
    /*
    else {
      getUserInfoFunc();
    }
    */
  }, []);

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", profile_image);
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setImgUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {user?.username ? (
        <>
          <div className="position-profile-account">
            <div className="container-profile">
              <div className="centering-wrapper-account">
                <div className="section1 text-center">
                  <p className="primary-header-username">My Account</p>
                  <br></br>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt="profile_image"
                      className="profileImage"
                    />
                  ) : (
                    <img
                      src={user.profile_image}
                      alt="profile image"
                      className="profileImage"
                    />
                  )}
                  <br></br>
                  <button
                    onClick={() => {
                      uploadImage();
                    }}
                    className="btn-upload"
                  >
                    Upload Image
                  </button>
                  <br></br>
                  <div>
                    <input
                      type={"file"}
                      onChange={(e) => {
                        setProfile_image(e.target.files[0]);
                      }}
                      className="update-account"
                      id="file"
                    />
                    <label htmlFor="file" className="accountlable">
                      Choose a photo
                    </label>
                  </div>

                  <h3 className="primary-header-signup">{user.username}</h3>
                  <div className="input-position-signup">
                    <div className="form-group">
                      <h5 className="input-placeholder-account">Email</h5>
                      <input
                        type="email"
                        required={true}
                        defaultValue={user.email}
                        name="logemail"
                        className="form-style-account"
                        autoComplete={"off"}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <h5 className="input-placeholder-account">First Name</h5>
                      <input
                        type="text"
                        required={true}
                        name="logpass"
                        defaultValue={user.first_name}
                        className="form-style-account"
                        autoComplete={"on"}
                        onChange={(e) => {
                          setFirst_name(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <h5 className="input-placeholder-account">Last Name</h5>
                      <input
                        type="text"
                        required={true}
                        name="logemail"
                        className="form-style-account"
                        autoComplete={"off"}
                        defaultValue={user.last_name}
                        onChange={(e) => {
                          setLast_name(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <h5 className="input-placeholder-account">Country</h5>
                      <input
                        type="text"
                        required={true}
                        name="logemail"
                        className="form-style-account"
                        autoComplete={"off"}
                        defaultValue={user.country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="password-container"></div>
                  <div className="btn-position">
                    <div>
                      <p className="error-message">{message}</p>
                    </div>
                    <br></br>
                    <button className="btn-account" onClick={updateUserInfoFun}>
                      Update Account Information
                    </button>
                    <button
                      className="btn-account"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <br></br>
      {isOpen && <UpdatePasswordModal setIsOpen={setIsOpen} />}
    </>
  );
};

export default AccountPage;
