//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//importing css
import "./style.css";

//since we used export directly then when we import we have to add the {} or an error will occur
export const RightThisRoom = () => {
  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [errMessage, setErrMessage] = useState("");

  // `useParams` returns an object that contains the URL parameters
  const { id } = useParams();

  const getRoomById = () => {
    axios
      .get(`http://localhost:5000/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.room[0].name);
        setName(result.data.room[0].name);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
      });
  };

  //the reason that i add the navigate because if the user was not logged in then redirect him to the signin page
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      getRoomById();
    }
  }, [id]);

  return (
    <>
      <div className="right-this-room">
        <div className="specific-size-for-right">
          <div className="room-navbar">
            <button>update room</button>
            <button>update room</button>
            <button>update room</button>
          </div>
          <div>
            <p>{name}</p>
          </div>

          <div>{errMessage && <p>{errMessage}</p>}</div>
        </div>
      </div>
    </>
  );
};
