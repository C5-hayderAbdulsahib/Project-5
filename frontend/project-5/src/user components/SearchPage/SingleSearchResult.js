import { useSelector, useDispatch } from "react-redux";
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

  // console.log("this is me", user.id);

  console.log("the room id is", search);

  const dispatch = useDispatch();

  const usersRoomsRelationsFun = () => {
    axios
      .get(`http://localhost:5000/rooms/user_room_relation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setUserRoomRelation(result.data.users_rooms_relation);
        // console.log(result);
      })
      .catch((err) => {
        throw err;
      });
  };

  const createPrivateRoom = (userId) => {
    console.log(userId);
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
        console.log(result);
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
        console.log(result);
        setRenderSinglePage(!renderSinglePage);
      })
      .catch((err) => {
        throw err;
      });
  };

  const unFollowRoom = (roomId) => {
    console.log("the id is", roomId);
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
        console.log(result);
        setRenderSinglePage(!renderSinglePage);
      })
      .catch((err) => {
        throw err;
      });
  };

  // console.log(userRoomRelation);

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

            <h1>{search.username}</h1>
            <p>this is user</p>

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
                <button>view Conversation</button>
              </Link>
            ) : (
              <button onClick={() => createPrivateRoom(search.id)}>
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
              <div className="room-name">   <h1>{search.name}</h1></div>
              <div className="room-type">  <p>Group</p></div>

                {userRoomRelation?.forEach((element) => {
                  console.log(element);
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
                    <button>view Room</button>
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
