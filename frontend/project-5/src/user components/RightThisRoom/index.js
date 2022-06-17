//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import fileDownload from "js-file-download";

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

//socket connection
const ENDPOINT = "http://localhost:5000";
const socket = io.connect(ENDPOINT);

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

  //states for socket
  const [messageContentState, setMessageContentState] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [updateInput, setUpdateInput] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(-1);

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
        // console.log(result.data.room);
        setRoom(result.data.room);
        setErrMessage("");

        socket.emit("JOIN_ROOM", result.data.room.id);

        socket.emit("GET_MESSAGES", result.data.room.id);
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

  // socket io for messages
  //this useEffect is used to bring any data when the emit event is triggered from the backend
  useEffect(() => {
    socket.on("SEND_MESSAGE_TO_FRONT", (allMessages) => {
      setMessageList(allMessages);
    });
  });

  const sendMessage = (e) => {
    e.preventDefault();
    const messageContent = {
      room_id: room.id,
      content: {
        user_id: user.id,
        username: user.username,
        description: messageContentState,
      },
    };

    socket.emit("SEND_MESSAGE_TO_BACKEND", messageContent);

    socket.on("SEND_NEW_MESSAGE_TO_FRONT", (allMessages) => {
      setMessageList(allMessages);
    });
  };

  const sendImage = (imgURL) => {
    console.log("the image url is this one", imgURL);
    const messageContent = {
      room_id: room.id,
      content: {
        user_id: user.id,
        username: user.username,
        message_image: imgURL,
      },
    };

    socket.emit("SEND_IMAGE_TO_BACKEND", messageContent);

    socket.on("SEND_MESSAGE_TO_FRONT", (allMessages) => {
      setMessageList(allMessages);
    });
  };

  const sendFile = (fileURL) => {
    console.log("the file url is this one", fileURL);
    const messageContent = {
      room_id: room.id,
      content: {
        user_id: user.id,
        username: user.username,
        document: fileURL,
      },
    };

    socket.emit("SEND_File_TO_BACKEND", messageContent);

    socket.on("SEND_MESSAGE_TO_FRONT", (allMessages) => {
      setMessageList(allMessages);
    });
  };

  const deleteMessage = (messageId, roomId) => {
    socket.emit("DELETE_MESSAGE", messageId, roomId);
  };

  const updateMessage = (e, messageId, roomId) => {
    e.preventDefault();
    console.log(updatedMessage);
    socket.emit("UPDATE_MESSAGE", messageId, roomId, updatedMessage);
  };

  //this function is for uploading images on my account on cloudinary server
  const uploadImage = (imgData) => {
    const data = new FormData();
    data.append("file", imgData); //adding the image to the state
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.url);
        sendImage(data.url);
      })
      .catch((err) => console.log(err));
  };

  //this function is for uploading files on my account on cloudinary server
  const uploadFile = (fileData) => {
    const data = new FormData();
    data.append("file", fileData); //adding the file to the state
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/raw/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        sendFile(data.url);
      })
      .catch((err) => console.log(err));
  };

  //this function is for downloading the cv
  const downloadFile = (fileUrl) => {
    let filePath = fileUrl;
    axios
      .get(`${filePath}`, {
        responseType: "blob",
      })
      .then((res) => {
        let filename = filePath.replace(/^.*[\\\/]/, "");
        let fileExtension;
        fileExtension = filePath.split(".");
        fileExtension = fileExtension[fileExtension.length - 1];
        fileDownload(res.data, `${filename}.${fileExtension}`);
      });
  };

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
                      className="leaveIcon"
                      onClick={() => {
                        // setIsOpenFollowRequest(true);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="centerSide">
            {messageList.map((element, index) => {
              return (
                <div key={index}>
                  {element.description && (
                    <div className="messages">
                      <div className="sendImage">
                        <img
                          src={element.profile_image}
                          alt="user image"
                          className="sendImageProfile"
                        />
                      </div>

                      <div className="sendName">
                        <div className="userInfoContainer">
                          <p className="userNameSend">{element.username}</p>

                          <span className="date">
                            {new Date(element.created_at)
                              .toString()
                              .substring(4, 10) +
                              "-" +
                              new Date(element.created_at)
                                .toString()
                                .substring(16, 21)}
                          </span>
                        </div>

                        <div className="messageTextContainer">
                          {updateInput && messageIndex === index ? (
                            <form
                              onSubmit={(e) => {
                                updateMessage(e, element.id, room.id);
                                setUpdateInput(!updateInput);
                              }}
                            >
                              <input
                                defaultValue={element.description}
                                onChange={(e) =>
                                  setUpdatedMessage(e.target.value)
                                }
                              />
                            </form>
                          ) : (
                            <span className="messageText">
                              <p> {element.description}</p>
                            </span>
                          )}
                        </div>
                      </div>

                      {element.user_id === user.id && (
                        <div className="menuContainer">
                          <IoMdCreate
                            className="updateMessage"
                            onClick={() => {
                              setUpdateInput(!updateInput);
                              console.log(index);
                              setMessageIndex(index);
                            }}
                          />

                          <MdDelete
                            className="deleteMessage"
                            onClick={() => {
                              deleteMessage(element.id, room.id);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {element.message_image && (
                    <div className="messagesImage">
                      <div className="sendName">
                        <div className="userInfoContainerImage">
                          <div>
                            <img
                              className="sendImageProfile"
                              src={element.profile_image}
                              alt="user profile image"
                            />
                          </div>
                          <div>
                            <p className="userNameSend"> {element.username}</p>
                          </div>
                          <div className="dateImageDiv">
                            <span className="dateImage">
                              Date:
                              {new Date(element.created_at)
                                .toString()
                                .substring(4, 10) +
                                "-" +
                                new Date(element.created_at)
                                  .toString()
                                  .substring(16, 21)}
                            </span>
                          </div>
                          <div className="iconContainer">
                            <AiOutlineDownload
                              className="DownloadDocumentMessage"
                              onClick={() => {
                                downloadFile(element.message_image);
                              }}
                            />

                            {element.user_id === user.id && (
                              <MdDelete
                                className="deleteMessage"
                                onClick={() => {
                                  deleteMessage(element.id, room.id);
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="messageTextContainerDocument">
                          <img
                            className="imageDocument"
                            src={element.message_image}
                            alt="user send image"
                          />
                          <div className="documentcontainer"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {element.document && (
                    <div className="messagesDocument">
                      <div className="sendImage">
                        <img
                          src={element.profile_image}
                          alt="user image"
                          className="sendImageProfile"
                        />
                      </div>

                      <div className="sendName">
                        <div className="userInfoContainer">
                          <p className="userNameSend">{element.username}</p>

                          <span className="date">
                            {new Date(element.created_at)
                              .toString()
                              .substring(4, 10) +
                              "-" +
                              new Date(element.created_at)
                                .toString()
                                .substring(16, 21)}
                          </span>
                        </div>

                        <div className="messageTextContainerDocument">
                          <AiFillFile className="documentIcon" />

                          <a href="#" className="document-name">
                            {"this is a old File File file" +
                              "element.document"}
                          </a>

                          <div className="documentcontainer">
                            <AiOutlineDownload
                              className="DownloadDocumentMessage"
                              onClick={() => {
                                downloadFile(element.document);
                              }}
                            />

                            {element.user_id === user.id && (
                              <MdDelete
                                className="deleteMessage"
                                onClick={() => {
                                  deleteMessage(element.id, room.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* //////////////////////////////////////////////// */}
          {/* static data by mosa */}
          {/* <div className="messages">
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
            </div> */}

          {/* //////////////////////////////////////////////// */}
          {/* message document styling */}
          {/* <div className="messagesDocument">
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
            </div> */}
          {/* ///////////////////////////////////////////////// */}
          {/* message image styling */}
          {/* <div className="messagesImage">
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
            </div> */}

          <div className="buttomSide">
            <div className="InputFelid">
              {/* <form> </form> */}
              <input
                className="inputMessage"
                type={"text"}
                placeholder={`Message The ${room.name}`}
                onChange={(e) => {
                  setMessageContentState(e.target.value);
                }}
              />
            </div>

            <div className="buttomIcons">
              <div className="sendReactIcon">
                <IoSend className="sendIconTow" onClick={sendMessage} />
              </div>

              <div className="toolTipButtom">
                <span className="toolTipTextBottom">Upload File</span>
                <input
                  type={"file"}
                  className="update-account"
                  id="uploadFile"
                  onChange={(e) => {
                    uploadFile(e.target.files[0]);
                  }}
                />
                <label htmlFor="uploadFile">
                  <TbFileUpload className="sendIconTow" />
                </label>
              </div>

              <div className="toolTipButtom">
                <span className="toolTipTextBottom">Upload Image</span>
                <input
                  type={"file"}
                  className="update-account"
                  id="ImageUpload"
                  onChange={(e) => {
                    console.log(e.target.files[0]);
                    uploadImage(e.target.files[0]);
                  }}
                />
                <label htmlFor="ImageUpload">
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
