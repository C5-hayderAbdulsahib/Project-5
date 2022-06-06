import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const GetRoomId = () => {
  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const getRoomById = () => {
    axios
      .get(`http://localhost:5000/rooms/18`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.room[0].name);
        setName(result.data.room[0].name);
        setId(18)
      });
  };

  return (
    <>
      <div>
        <div>
          <p>room by id</p>
          <button onClick={getRoomById}>Get Room</button>
          <br></br>
          <Link to={`/room/${id}`}>{name}</Link>
        </div>
      </div>
    </>
  );
};


