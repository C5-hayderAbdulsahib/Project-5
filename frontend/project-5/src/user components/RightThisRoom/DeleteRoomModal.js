import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//import actions
import { deleteRoom } from "../../redux/reducers/rooms";

//import styling
import "./DeleteRoomModal.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

export const DeleteRoomModal = (props) => {
  const {
    id,
    setRenderPage,
    renderPage,
    // logout,
    setIsOpenDelete,
    // token,
  } = props;

  const dispatch = useDispatch("");

  const navigate = useNavigate();

  //======================================================================================================

  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const deleteRoomFun = (id) => {
    axios
      .delete(
        `http://localhost:5000/rooms/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(deleteRoom(id));
        setRenderPage(!renderPage);
        navigate("/rooms");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="DeleteRoomModal">
        {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
        <div className="darkBG" onClick={() => setIsOpenDelete(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Dialog</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpenDelete(false)}>
              <RiCloseLine
                className="closeIcon"
                style={{ marginBottom: "-3px" }}
              />
            </button>

            <div className="modalContent">
              {/* ///////////////////////////////the body f the model */}
              Are you sure you want to delete the name of this Room?
              <div className="push-down"></div>
              <div className="push-down"></div>
              {/* the update button */}
              <button
                onClick={() => {
                  deleteRoomFun(id);
                  setIsOpenDelete(false);
                }}
                className="DeleteButton"
              >
                Delete Room
              </button>
              {/* the cancel model button */}
              <button
                className="cancelButton"
                onClick={() => setIsOpenDelete(false)}
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

export default DeleteRoomModal;
