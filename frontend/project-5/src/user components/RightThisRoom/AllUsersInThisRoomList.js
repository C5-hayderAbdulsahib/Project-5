//import packages
import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import axios from "axios";

//import styling
import "./AllUsersInThisRoomList.css";

const AllUsersInThisRoomList = (props) => {
  const { setIsOpenUsersList, roomId } = props;

  const [message, setMessage] = useState("");

  const [usersInRoom, setUsersInRoom] = useState([]);

  const [renderPage, setRenderPage] = useState(false);

  //*=================================================================================

  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });
  //*=================================================================================

  const allUsersInThisRoomFun = (roomId) => {
    axios
      .get(`http://localhost:5000/rooms/${roomId}/allusers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log("all the users in room", result.data.roomUsers);
        setUsersInRoom(result.data.roomUsers);
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Get Data, please try again");
      });
  };

  const blockUser = (roomId, userId) => {
    axios
      .delete(`http://localhost:5000/rooms/${roomId}/users/block`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId,
        },
      })
      .then((result) => {
        console.log(result.data.message);
        setRenderPage(!renderPage);
        // setMessage(result.response.data.message);
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Get Data, please try again");
      });
  };

  const unBlockUser = (roomId, userId) => {
    axios
      .put(
        `http://localhost:5000/rooms/${roomId}/users/unblock`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        console.log(result.data.message);
        setRenderPage(!renderPage);
        // setMessage(result.response.data.message);
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Get Data, please try again");
      });
  };

  useEffect(() => {
    allUsersInThisRoomFun(roomId);
  }, [renderPage]);

  //*=================================================================================

  return (
    <>
      <div className="allUsersInThisRoomFun">
        <div>
          <>
            {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
            <div
              className="darkBG"
              onClick={() => {
                setIsOpenUsersList(false);
              }}
            />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Users List</h5>
                </div>
                <button
                  className="closeBtn"
                  onClick={() => {
                    setIsOpenUsersList(false);
                  }}
                >
                  <RiCloseLine
                    className="closeIcon"
                    style={{ marginBottom: "-3px" }}
                  />
                </button>

                <div className="modalContent">
                  {/* ///////////////////////////////the body f the model */}
                  <p className="title">These are all the users in the room</p>
                  {usersInRoom?.map((element) => {
                    return (
                      <>
                        <div className="main" key={element.user_id}>
                          <p className="userName">{element.username}</p>

                          {element.is_blocked === 0 ? (
                            <button
                              className="blockButton"
                              onClick={() => blockUser(roomId, element.user_id)}
                            >
                              block user
                            </button>
                          ) : (
                            <button
                              className="ubBlockBtn"
                              onClick={() =>
                                unBlockUser(roomId, element.user_id)
                              }
                            >
                              unblock user
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })}
                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => {
                      setMessage("");
                      setIsOpenUsersList(false);
                    }}
                  >
                    Cancel
                  </button>
                  <p>{message}</p>
                </div>

                {/* // ... */}
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default AllUsersInThisRoomList;
