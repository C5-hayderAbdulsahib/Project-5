import axios from "axios";
import { useDispatch ,useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";

//import styling
import "./DeleteRoomModal.css";

import { getAllMyRooms } from "../../redux/reducers/rooms";
//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

export const LeaveRoomModel = (props) => {
  const {
    roomId,
    setRenderPage,
    roomName,
    // logout,
    setIsOpenLeaveRoom,
    renderPage,

    // token,
  } = props;

  const navigate = useNavigate();

  const dispatch = useDispatch()
  //======================================================================================================

  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const leaveRoom = (id) => {
    axios
      .put(
        `http://localhost:5000/rooms/${id}/leave_room`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        console.log(result);
        dispatch(getAllMyRooms());
        setRenderPage(!renderPage);
        navigate(`/rooms`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="DeleteRoomModal">
        {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
        <div className="darkBG" onClick={() => setIsOpenLeaveRoom(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Dialog</h5>
            </div>
            <button
              className="closeBtn"
              onClick={() => setIsOpenLeaveRoom(false)}
            >
              <RiCloseLine
                className="closeIcon"
                style={{ marginBottom: "-3px" }}
              />
            </button>

            <div className="modalContent">
              {/* ///////////////////////////////the body f the model */}
              `Are you sure you want to Leave the {roomName} Room?`
              <div className="push-down"></div>
              <div className="push-down"></div>
              {/* the update button */}
              <button
                onClick={() => {
                  leaveRoom(roomId);
                  setIsOpenLeaveRoom(false);
                }}
                className="DeleteButton"
              >
                Leave Room
              </button>
              {/* the cancel model button */}
              <button
                className="cancelButton"
                onClick={() => setIsOpenLeaveRoom(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaveRoomModel;
