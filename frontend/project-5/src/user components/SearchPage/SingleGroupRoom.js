import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//importing css
import "./style.css";

const SingleRoom = (props) => {
  const { room } = props; //we used destructuring to make it easier to use them

  const { token, user } = useSelector((state) => {
    return {
      token: state.auth.token,
      user: state.user.user,
    };
  });

  const [userRoomRelation, setUserRoomRelation] = useState([]);

  const [renderSinglePage, setRenderSinglePage] = useState(false);

  console.log(room);

  const usersRoomsRelationsFun = () => {
    axios
      .get(`http://localhost:5000/rooms/user_room_relation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setUserRoomRelation(result.data.users_rooms_relation);
      })
      .catch((err) => {
        throw err;
      });
  };

  const FollowRoom = (roomId) => {
    axios
      .post(
        `http://localhost:5000/rooms/${roomId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setRenderSinglePage(!renderSinglePage);
      })
      .catch((err) => {
        throw err;
      });
  };

  const unFollowRoom = (roomId) => {
    axios
      .put(
        `http://localhost:5000/rooms/${roomId}/unfollow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setRenderSinglePage(!renderSinglePage);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    usersRoomsRelationsFun();
  }, [renderSinglePage]);

  let inRoom = false;
  let alreadyFollowed = false;

  return (
    <>
      {room?.name ? (
        <>
          <div className="result-Room">
            <div className="img-div">
              <img className="result-image" src={room.room_image} />
            </div>

            <div className="room-name">
              <h1>{room.name}</h1>
            </div>
            <div className="room-type">
              <p className="this-is-room">Group</p>
            </div>

            {userRoomRelation?.forEach((element) => {
              if (
                element.room_id === room.id &&
                element.user_id === user.id &&
                element.is_member === 1
              ) {
                inRoom = true;
              }
              if (
                element.room_id === room.id &&
                element.user_id === user.id &&
                element.send_follow_request === 1
              ) {
                alreadyFollowed = true;
              }
            })}

            <div className="result-button">
              {inRoom ? (
                <Link to={`/rooms/${room.id}`}>
                  <button className="view-Room">View Room</button>
                </Link>
              ) : alreadyFollowed ? (
                <button
                  className="unfollow-btn"
                  onClick={() => unFollowRoom(room.id)}
                >
                  unfollow room
                </button>
              ) : (
                <button
                  className="follow-btn"
                  onClick={() => {
                    FollowRoom(room.id);
                    usersRoomsRelationsFun();
                  }}
                >
                  follow room
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default SingleRoom;
