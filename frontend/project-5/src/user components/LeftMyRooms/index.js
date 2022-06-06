//import packages
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { getAllMyRooms } from "../../redux/reducers/rooms";

//import component

import { RightThisRoom } from "../RightThisRoom";

import "./style.css";

const LeftMyRooms = () => {
  const dispatch = useDispatch();
  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });

  return (
    <>
      <div className="display-grid">
        <div>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
          <p>this is the left side with all my rooms</p>
        </div>
        <div>
          <Routes>
            <Route path="/:id" element={<RightThisRoom />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default LeftMyRooms; //if we use export default then when we import we dont use {} or an error will appear
