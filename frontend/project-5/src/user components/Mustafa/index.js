//import packages
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//import actions

import { updateRoom } from "../../redux/reducers/rooms";

//import Components

import UpdateRoomModal from "./UpdateRoomModal";

const Mustafa = () => {
  const dispatch = useDispatch("");

  //======================================================================================================

  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });

  const [message, setMessage] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  /* const UpdateRoomFun = (id = 1) => {
    axios
      .put(
        `http://localhost:5000/rooms/${id}`,
        { name: updateName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(updateRoom({ id, name: updateName }));
      })
      .catch((err) => {
        console.log(err);
      });
  }; */

  return (
    <>
      {isOpen && (
        <UpdateRoomModal
          setIsOpen={setIsOpen}
         
        />
      )}

      <div>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Update
        </button>
        <br></br>

        {message ? <p>{message}</p> : ""}
      </div>
    </>
  );
};

export default Mustafa;
