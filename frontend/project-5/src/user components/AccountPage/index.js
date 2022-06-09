// import hooks
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import from store
import { useSelector, useDispatch } from "react-redux";

//import actions
import { getUserInfo } from "../../redux/reducers/user";

//import Model
import UpdatePasswordModal from "./UpdatePasswordModal";

const AccountPage = () => {
  const { token, user } = useSelector((state) => {
    return { token: state.auth.token, user: state.user.user };
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [info, setInfo] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [country, setCountry] = useState("");
  const [profile_image, setProfile_image] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

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

  const updateUserInfo = () => {
    axios
      .put(
        `http://localhost:5000/users/change_info`,
        {
          email,
          first_name,
          last_name,
          country,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setMessage(`update information`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      getUserInfoFunc();
    }
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

  setTimeout(function () {
    setMessage("");
  }, 3000);

  return (
    <>
      {user?.username ? (
        <>
          <h1> account page </h1>

          <>
            <label>Email : </label>
            <input
              type={"text"}
              placeholder="Email"
              defaultValue={info.email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <br></br>
            <label>First name : </label>
            <input
              type={"text"}
              placeholder="First name"
              defaultValue={info.first_name}
              onChange={(e) => {
                setFirst_name(e.target.value);
              }}
            />
            <br></br>
            <label>Last name : </label>
            <input
              type={"text"}
              placeholder="Last Name"
              defaultValue={info.last_name}
              onChange={(e) => {
                setLast_name(e.target.value);
              }}
            />
            <br></br>
            <label>Country : </label>
            <input
              type={"text"}
              placeholder="Country"
              defaultValue={info.country}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            />
            <br></br>
            <p>{message}</p>
            <button onClick={updateUserInfo}>update profile</button>
          </>

          <br></br>
          {imgUrl ? (
            <img src={imgUrl} alt="profile_image" />
          ) : (
            <img src={profile_image} alt="profile image" />
          )}
          <br></br>
          <button
            onClick={() => {
              uploadImage();
            }}
          >
            Upload Image
          </button>
          <br></br>
          <input
            type={"file"}
            onChange={(e) => {
              setProfile_image(e.target.files[0]);
            }}
          />
        </>
      ) : (
        ""
      )}
      <br></br>
      {isOpen && <UpdatePasswordModal setIsOpen={setIsOpen} />}
      <button onClick={()=>{setIsOpen(true)}}>Update Password</button>
    </>
  );
};

export default AccountPage;
