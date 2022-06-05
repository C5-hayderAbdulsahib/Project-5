import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
 
//import actions

import { updateRoom } from "../../redux/reducers/rooms";


//import styling
import "./style.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

export const UpdateRoomModal = (props) => {
  const {
     

    // logout,
    setIsOpenUpdate,
    // token,
  } = props;

  const [updateName, setUpdateName] = useState("");
  const dispatch = useDispatch("");


  //======================================================================================================

  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });


  const UpdateRoomFun = (id = 1) => {
    axios
      .put(
        `http://localhost:5000/rooms/${id}`,
        { name: updateName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(updateRoom({ id, name: updateName }));
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="darkBG" onClick={() => setIsOpenUpdate(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Dialog</h5>
          </div>
          <button className="closeBtn" onClick={() => setIsOpenUpdate(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>

          <div className="modalContent">
            {/* ///////////////////////////////the body f the model */}
            Are you sure you want to update the name of this Room?
            <div className="push-down"></div>
            <form
              onSubmit={() => {
                UpdateRoomFun();
                setIsOpenUpdate(false);
              }}
            >
              <input
                type={"text"}
                placeholder="Update Room"
                defaultValue={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
              />
              <div className="push-down"></div>
              {/* the update button */}
              <button
                // onClick={() => {
                //   updateCategoryFun(id);
                //   setIsOpenUpdate(false);
                // }}
                className="deleteBtn"
              >
                Update Room
              </button>
              {/* the cancel model button */}
              <button className="cancelBtn" onClick={() => setIsOpenUpdate(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateRoomModal;
