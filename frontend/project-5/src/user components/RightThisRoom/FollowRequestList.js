//import packages
import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import axios from "axios";

//import styling
import "./FollowRequestList.css";

const FollowRequestList = (props) => {
  const { setIsOpenFollowRequest, roomId } = props;

  const [message, setMessage] = useState("");

  const [followRequestList, setFollowRequestList] = useState([]);

  const [renderPage, setRenderPage] = useState(false);

  //*=================================================================================

  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });
  //*=================================================================================

  const getAllFollowRequestListFun = (roomId) => {
    axios
      .get(`http://localhost:5000/rooms/${roomId}/follow_list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log("all the follow request", result.data.follow_requests);
        setFollowRequestList(result.data.follow_requests);
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Get Data, please try again");
      });
  };

  const addUserToGroupFun = (roomId, userId) => {
    axios
      .put(
        `http://localhost:5000/rooms/${roomId}/add_user`,
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

  const removeFollowRequestFun = (roomId, userId) => {
    axios
      .delete(`http://localhost:5000/rooms/${roomId}/remove_follow_request`, {
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

  useEffect(() => {
    getAllFollowRequestListFun(roomId);
  }, [renderPage]);

  //*=================================================================================

  return (
    <>
      <div className="FollowRequestList">
        <div>
          <>
            {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
            <div
              className="darkBG"
              onClick={() => {
                setIsOpenFollowRequest(false);
              }}
            />
            <div className="centered">
              <div className="modalFollow">
                <div className="modalHeader">
                  <h5 className="heading">Dialog</h5>
                </div>
                <button
                  className="closeBtn"
                  onClick={() => {
                    setIsOpenFollowRequest(false);
                  }}
                >
                  <RiCloseLine
                    className="closeIcon"
                    style={{ marginBottom: "-3px" }}
                  />
                </button>

                <div className="modalContent">
                  {/* ///////////////////////////////the body f the model */}
                  <div className="titleOfHeader">
                    <p>
                      These Are All the Follow Requests That Are Send To This
                      Room
                    </p>
                  </div>
                  {followRequestList?.map((element) => {
                    return (
                      <div className="requestContainer" key={element.user_id}>
                        <p className="userInfoName">{element.username}</p>

                        <button
                          className="acceptRequest"
                          onClick={() =>
                            addUserToGroupFun(roomId, element.user_id)
                          }
                        >
                          Accept Request
                        </button>
                        <button
                          className="removeRequest"
                          onClick={() =>
                            removeFollowRequestFun(roomId, element.user_id)
                          }
                        >
                          Remove Request
                        </button>
                      </div>
                    );
                  })}
                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => {
                      setMessage("");
                      setIsOpenFollowRequest(false);
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

export default FollowRequestList;
