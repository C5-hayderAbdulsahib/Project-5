import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SingleSearchResult = (props) => {
  const { search, renderPage, setRenderPage } = props; //we used destructuring to make it easier to use them

  const { rooms, token, user } = useSelector((state) => {
    return {
      rooms: state.rooms.rooms,
      token: state.auth.token,
      user: state.user.user,
    };
  });

  console.log("this is me", user.id);

  // console.log("the room id is", search);

  const dispatch = useDispatch();

  // const [inRoom, setInRoom] = useState(false);

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
        setRenderPage(!renderPage);
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
        setRenderPage(!renderPage);
      })
      .catch((err) => {
        throw err;
      });
  };

  let inRoom = false;
  let alreadyFollowed = false;
  let alreadyTalking = false;
  let roomId;

  return (
    <>
      {search?.username ? (
        <>
          <h1>{search.username}</h1>
          <p>this is user</p>

          {rooms.forEach((element) => {
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

          <hr></hr>
        </>
      ) : (
        ""
      )}

      {search?.name ? (
        <>
          <h1>{search.name}</h1>
          <p>this is a group room</p>

          {rooms.forEach((element) => {
            console.log(element);
            if (
              element.is_group === 1 &&
              element.room_id === search.id &&
              element.user_id &&
              element.is_member === 1
            ) {
              inRoom = true;
            }
            if (element.send_follow_request === 1) {
              alreadyFollowed = true;
            }
          })}

          {inRoom ? (
            <Link to={`/rooms/${search.id}`}>
              <button>view Room</button>
            </Link>
          ) : alreadyFollowed ? (
            <button onClick={() => unFollowRoom(search.id)}>
              unfoolow room
            </button>
          ) : (
            <button onClick={() => FollowRoom(search.id)}>foolow room</button>
          )}

          <hr></hr>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default SingleSearchResult;
