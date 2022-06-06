//import packages
import { Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { getAllMyRooms } from "../../redux/reducers/rooms";
import { useNavigate } from "react-router-dom";

//import component

import { RightThisRoom } from "../RightThisRoom";

import "./style.css";

const LeftMyRooms = () => {
  const dispatch = useDispatch();
  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });

  console.log(rooms);

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
  //============================================================
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      getAllRooms();
    }
  }, []);

  return (
    <>
      <div className="left-my-rooms">
        <div className="display-grid">
          <div>
            <div>
              {rooms &&
                rooms.map((element) => {
                  return (
                    <div key={element.id}>
                      <Link to={`/rooms/${element.id}`}>
                        <p>{element.name}</p>
                      </Link>
                    </div>
                  );
                })}
            </div>
            {message && <p>{message}</p>}
          </div>
          <div>
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
