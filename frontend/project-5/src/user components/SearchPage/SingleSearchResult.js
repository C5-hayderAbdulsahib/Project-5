import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SingleSearchResult = (props) => {
  const { search, renderPage, setRenderPage } = props; //we used destructuring to make it easier to use them

  const { rooms, token } = useSelector((state) => {
    return { rooms: state.rooms.rooms, token: state.auth.token };
  });

  console.log("the room id is", search);

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

  // const FollowRoom = () => {
  //   axios
  //     .post(
  //       `http://localhost:5000/rooms/individual_room`,
  //       { userId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((result) => {
  //       setRenderPage(!renderPage);
  //       console.log(result);
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // };

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
            if (element.is_group === 1 && element.room_id === search.id) {
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
            <button>unfoolow room</button>
          ) : (
            <button>foolow room</button>
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
