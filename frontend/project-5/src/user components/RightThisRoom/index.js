//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//importing css
import "./style.css";

//import component
import { UpdateRoomModel } from "./UpdateRoomModel";
import { DeleteRoomModal } from "./DeleteRoomModal";
import AllUsersInThisRoomList from "./AllUsersInThisRoomList";
import FollowRequestList from "./FollowRequestList";

// import react icon
import { TbClipboardList } from "react-icons/tb";
import { HiUserAdd } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { IoMdCreate } from "react-icons/io";
import { TbFileUpload } from "react-icons/tb";
import { MdAddPhotoAlternate } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { IoCreateOutline } from "react-icons/io5";
import { AiFillFile } from "react-icons/ai";
import { AiOutlineDownload } from "react-icons/ai";

//since we used export directly then when we import we have to add the {} or an error will occur
export const RightThisRoom = () => {
  const { token, user } = useSelector((state) => {
    return {
      token: state.auth.token,
      user: state.user.user,
    };
  });

  const navigate = useNavigate();

  const [errMessage, setErrMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false); //this state is for showing the the create room model
  const [room, setRoom] = useState("");

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenUsersList, setIsOpenUsersList] = useState(false);
  const [isOpenFollowRequest, setIsOpenFollowRequest] = useState(false);

  const [renderPage, setRenderPage] = useState(false);

  // `useParams` returns an object that contains the URL parameters
  const { id } = useParams();

  const getRoomById = () => {
    axios
      .get(`http://localhost:5000/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.room);
        setRoom(result.data.room);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
      });
  };

  //the reason that i add the navigate because if the user was not logged in then redirect him to the signin page
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      getRoomById();
    }
  }, [id, renderPage]); //the reason the i added the renderPage is because the get room by id came from the backend and it does not have a action in redux so it only have local state thats why i added the renderPage in order to make useEffect rerender the page again on update or delete

  return (
    <>
      {!errMessage ? (
        <>
          <div className="room-navbar">
            <div className="roomName-tow">
              <MdGroup className="groupIcon" />
              <p className="nameRoom">{room.name}</p>
            </div>
            <div className="roomController">
              {room.admin_id === user.id && (
                <>
                  <div className="toolTip">
                    <span className="toolTipText">Update Room</span>
                    <IoCreateOutline
                      className="updateRoom"
                      onClick={() => {
                        setIsOpenUpdate(true);
                      }}
                    />
                  </div>
                  <div className="toolTip">
                    <span className="toolTipText">Delete Room</span>
                    <MdDelete
                      className="deleteRoom"
                      onClick={() => {
                        setIsOpenDelete(true);
                      }}
                    />
                  </div>
                  <div className="toolTip">
                    <span className="toolTipText">User List</span>
                    <TbClipboardList
                      className="listIcon"
                      onClick={() => {
                        setIsOpenUsersList(true);
                      }}
                    />
                  </div>
                  <div className="toolTip">
                    <span className="toolTipText">Follow Request</span>
                    <HiUserAdd
                      className="FollowRequestList"
                      onClick={() => {
                        setIsOpenFollowRequest(true);
                      }}
                    />
                  </div>
                  <div className="toolTip">
                    <span className="toolTipText">Leave Room</span>
                    <ImExit
                      className="FollowRequestList"
                      onClick={() => {
                        setIsOpenFollowRequest(true);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="centerSide">
            <div className="messages">
              <div className="sendImage">
                <img
                  className="sendImageProfile"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTQ8DFOgujidIRil33r2QnSZ2Y_ZHahrUlw&usqp=CAU"
                  alt="user image"
                />
              </div>
              <div className="sendName">
                <div className="userInfoContainer">
                  <p className="userNameSend">Mosa saleh</p>
                  <span className="date">data</span>
                </div>
                <div className="messageTextContainer">
                  <span className="messageText">
                    asd asd asd asd a asd asd asd sdfag adf g asdf a asdg asdf
                    sadg asdf sadg
                  </span>
                </div>
              </div>
              <div className="menuContainer">
                <span className="toolTipText">Delete Message</span>
                <MdDelete className="deleteMessage" />
                <span className="toolTipText">Update Message</span>
                <IoMdCreate className="updateRoom" />
              </div>
            </div>
            <div className="messagesDocument">
              <div className="sendImage">
                <img
                  className="sendImageProfile"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTQ8DFOgujidIRil33r2QnSZ2Y_ZHahrUlw&usqp=CAU"
                  alt="user image"
                />
              </div>
              <div className="sendName">
                <div className="userInfoContainer">
                  <p className="userNameSend">Mosa saleh</p>
                  <span className="date">data</span>
                </div>
                <div className="messageTextContainerDocument">
                  <AiFillFile className="documentIcon" />
                  <a href="#" className="">
                    mosa SAleh
                  </a>
                  <div className="documentcontainer">
                    <MdDelete className="deleteDocumentMessage" />

                    <AiOutlineDownload className="DownloadDocumentMessage" />
                  </div>
                </div>
              </div>
            </div>
            <div className="messagesImage">
              <div className="sendImage">
                <img
                  className="sendImageProfile"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkTQ8DFOgujidIRil33r2QnSZ2Y_ZHahrUlw&usqp=CAU"
                  alt="user image"
                />
              </div>
              <div className="sendName">
                <div className="userInfoContainerImage">
                  <p className="userNameSend">Mosa saleh</p>
                  <span className="dateImage">data</span>
                  <div className="iconContainer">
                    <MdDelete className="deleteDocumentMessage" />
                    <AiOutlineDownload className="DownloadDocumentMessage" />
                  </div>
                </div>
                <div className="messageTextContainerDocument">
                  <img
                    className="imageDocument"
                    src="https://techcrunch.com/wp-content/uploads/2021/05/Discord_IAP_KeyVisuals_Header_02.jpeg"
                  />
                  <div className="documentcontainer"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="buttomSide">
            <div className="InputFelid">
              <input
                className="inputMessage"
                type={"text"}
                placeholder={`Message The ${room.name}`}
              />
            </div>
            <div className="buttomIcons">
              <div className="sendReactIcon">
                <IoSend className="sendIconTow" />
              </div>
              <div className="toolTipButtom">
                <span className="toolTipTextBottom">Upload File</span>
                <input type={"file"} className="update-account" id="file" />
                <label htmlFor="file">
                  <TbFileUpload className="sendIconTow" />
                </label>
              </div>
              <div className="toolTipButtom">
                <span className="toolTipTextBottom">Upload Image</span>
                <input type={"image"} className="update-account" id="file" />
                <label htmlFor="file">
                  <MdAddPhotoAlternate className="sendIconTow" />
                </label>
              </div>
            </div>
          </div>

          {isOpenUpdate && (
            <UpdateRoomModel
              setIsOpenUpdate={setIsOpenUpdate}
              roomName={room.name}
              id={id}
              setRenderPage={setRenderPage}
              renderPage={renderPage}
            />
          )}
          {isOpenDelete && (
            <DeleteRoomModal
              setIsOpenDelete={setIsOpenDelete}
              id={id}
              setRenderPage={setRenderPage}
              renderPage={renderPage}
            />
          )}
          {isOpenUsersList && (
            <AllUsersInThisRoomList
              setIsOpenUsersList={setIsOpenUsersList}
              roomId={id}
            />
          )}
          {isOpenFollowRequest && (
            <FollowRequestList
              setIsOpenFollowRequest={setIsOpenFollowRequest}
              roomId={id}
            />
          )}
        </>
      ) : (
        <div>{errMessage && <p>{errMessage}</p>}</div>
      )}
    </>
  );
};
