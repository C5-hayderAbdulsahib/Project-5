//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//importing css
import "./style.css";

//import component
import { CreateNewRoomModal } from "./CreateNewRoomModal";
import { UpdateRoomModel } from "./UpdateRoomModel";
import { DeleteRoomModal } from "./DeleteRoomModal";

//since we used export directly then when we import we have to add the {} or an error will occur
export const RightThisRoom = () => {
  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });

  const navigate = useNavigate();

  const [errMessage, setErrMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false); //this state is for showing the the create room model
  const [roomName, setRoomName] = useState("");

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

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
        console.log(result.data.room.name);
        setRoomName(result.data.room.name);
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
      <div className="right-this-room">
        <div className="specific-size-for-right">
          {!errMessage ? (
            <>
              <div className="room-navbar">
                <button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  create room
                </button>

                <button
                  onClick={() => {
                    setIsOpenUpdate(true);
                  }}
                >
                  update room
                </button>

                <button
                  onClick={() => {
                    setIsOpenDelete(true);
                  }}
                >
                  delete room
                </button>
              </div>
              <div>
                <p>{roomName}</p>

                {isOpen && <CreateNewRoomModal setIsOpen={setIsOpen} />}

                {isOpenUpdate && (
                  <UpdateRoomModel
                    setIsOpenUpdate={setIsOpenUpdate}
                    roomName={roomName}
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
              </div>
            </>
          ) : (
            <div>{errMessage && <p>{errMessage}</p>}</div>
          )}
        </div>
      </div>
    </>
  );
};
