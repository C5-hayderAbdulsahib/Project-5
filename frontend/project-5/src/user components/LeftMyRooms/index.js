//import packages
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//import component
import { RightThisRoom } from "../RightThisRoom";

//import actions
import { getAllMyRooms } from "../../redux/reducers/rooms";
import { getUserInfo, isAdminPage } from "../../redux/reducers/user";

//import styling
import "./style.css";

const LeftMyRooms = () => {
  const dispatch = useDispatch();
  const { token, rooms } = useSelector((state) => {
    return {
      token: state.auth.token,
      rooms: state.rooms.rooms,
    };
  });

  console.log("all my rooms", rooms);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //============================================================
  const getAllRooms = () => {
    axios
      .get(`http://localhost:5000/rooms/my_rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(getAllMyRooms(result.data.rooms));
        if (result.data.message === "No Room Were Created Yet")
          setMessage(result.data.message);
      });
  };

  ////////////////////////////////////this function is to get the user info and save it value in redux and also in the localStorage
  const getUserInfoFunc = () => {
    axios
      .get(`http://localhost:5000/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(getUserInfo(result.data.user[0]));
      });
  };

  //============================================================
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      dispatch(isAdminPage(""));
      localStorage.removeItem("isAdminPage");
      getAllRooms();
      getUserInfoFunc();
    }
  }, []);

  return (
    <>
      <div className="left-my-rooms">
        <div className="display-grid">
          <div className="allMyRooms">
            <div className="titleRooms">
              <h3>All Rooms</h3>
            </div>
            <div>
              {rooms &&
                rooms.map((element) => {
                  return (
                    <div
                      className="roomInfoContainer"
                      key={element.id}
                      onClick={() => {
                        navigate(`/rooms/${element.id}`);
                      }}
                    >
                      <img
                        className="roomImage"
                        src={element.room_image}
                        alt="room-image"
                      />

                      <p className="roomName">#{element.name}</p>
                    </div>
                  );
                })}
            </div>

            {message && <p>{message}</p>}
          </div>
          <div className="rightSideHomePage">
            {/* the reason that i added this part because the RightThisRoom is nested route of this route   */}
            <Routes>
              <Route path="/:id" element={<RightThisRoom />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftMyRooms; //if we use export default then when we import we dont use {} or an error will appear
