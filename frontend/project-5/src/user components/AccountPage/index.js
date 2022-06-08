// import hooks
import axios from "axios";
import { useState , useEffect } from "react";

// import from store
import { useSelector } from "react-redux";

const AccountPage = () => {

const {token} = useSelector((state)=>{
  return {token : state.auth.token}
})

  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [country, setCountry] = useState("");
  const [profile_image, setProfile_image] = useState("");
  const [imgUrl, setImgUrl] = useState("");

const getUserInfo  = ()=>{
  axios
    .get(`http://localhost:5000/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => {
      console.log(result);
    });
}

useEffect(()=>{
  getUserInfo();
})

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
      <h1> account page </h1>

      {imgUrl ? (
        <img src={imgUrl} alt="profile_image" />
      ) : (
        <img src={profile_image} alt="profile image" />
      )}
      <br></br>
      <button onClick={uploadImage}>Upload Image</button>
      <br></br>
      <input
        type={"file"}
        onChange={(e) => {
          setProfile_image(e.target.files[0]);
        }}
      />
    </>
  );
};

export default AccountPage;
