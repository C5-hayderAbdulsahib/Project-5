import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//import packages
import React from "react";

//importing css
import "./style.css";

const SingleSearchResult = (props) => {
  const { search, renderPage, setRenderPage } = props; //we used destructuring to make it easier to use them

  const { rooms, token, user } = useSelector((state) => {
    return {
      rooms: state.rooms.rooms,
      token: state.auth.token,
      user: state.user.user,
    };
  });

  const [userRoomRelation, setUserRoomRelation] = useState([]);

  const [renderSinglePage, setRenderSinglePage] = useState(false);

  // console.log("the room id is", search);

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

  const createPrivateRoom = (userId) => {
    axios
      .post(
        `http://localhost:5000/rooms/individual_room`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        setRenderPage(!renderPage);
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
  let alreadyTalking = false;
  let roomId;

  return (
    <>
      {search?.username ? (
        <>
          <div className="result-User">
            <img className="result-image" src={search.profile_image} />

            <h1 className="user-name">{search.username}</h1>
            <div>
              <p className="this-is-user">User</p>
            </div>

            {rooms?.forEach((element) => {
              if (
                element.is_group === 0 &&
                element.user_username === search.username
              ) {
                alreadyTalking = true;
                roomId = element.room_id;
              }
            })}

            {alreadyTalking ? (
              <Link to={`/rooms/${roomId}`}>
                <button className="view-Conversation">view Conversation</button>
              </Link>
            ) : (
              <button
                className=" start-new-Conversation"
                onClick={() => createPrivateRoom(search.id)}
              >
                start new Conversation
              </button>
            )}
          </div>
        </>
      ) : (
        ""
      )}

      {search?.name ? (
        <>
          <div className="result-Room">
            <div className="img-div">
              <img className="result-image" src={search.room_image} />
            </div>

            {/*    <div className="room-info"> */}
            {/* <div className="result-text"> */}
            <div>
              <h1 className="room-name">{search.name}</h1>
            </div>
            <div className="room-type">
              <p className="this-is-room">Group</p>
            </div>

            {userRoomRelation?.forEach((element) => {
              if (
                element.room_id === search.id &&
                element.user_id === user.id &&
                element.is_member === 1
              ) {
                inRoom = true;
              }
              if (
                element.room_id === search.id &&
                element.user_id === user.id &&
                element.send_follow_request === 1
              ) {
                alreadyFollowed = true;
              }
            })}
            {/*    </div> */}

            <div className="result-button">
              {inRoom ? (
                <Link to={`/rooms/${search.id}`}>
                  <button className="view-Room">View Room</button>
                </Link>
              ) : alreadyFollowed ? (
                <button
                  className="unfollow-btn"
                  onClick={() => unFollowRoom(search.id)}
                >
                  unfollow room
                </button>
              ) : (
                <button
                  className="follow-btn"
                  onClick={() => {
                    FollowRoom(search.id);
                    usersRoomsRelationsFun();
                  }}
                >
                  follow room
                </button>
              )}
            </div>
            {/*  </div> */}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default SingleSearchResult;
