import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
 
//import actions

import { deleteRoom } from "../../redux/reducers/rooms";


//import styling
import "./style.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

export const DeleteRoomModal = (props) => {
  const {
     

    // logout,
    setIsOpenDelete,
    // token,
  } = props;

 
  const dispatch = useDispatch("");


  //======================================================================================================

  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });


  const deleteRoomFun = (id = 1) => {
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
        dispatch(deleteRoom( id));
      })
      .catch((err) => {
        console.log(err);
      });
  };


  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="darkBG" onClick={() => setIsOpenDelete(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Dialog</h5>
          </div>
          <button className="closeBtn" onClick={() => setIsOpenDelete(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>

          <div className="modalContent">
            {/* ///////////////////////////////the body f the model */}
            Are you sure you want to delete the name of this Room?
            <div className="push-down"></div>
          
               
        
              <div className="push-down"></div>
              {/* the update button */}
              <button
                 onClick={() => {
                  deleteRoomFun();
                  setIsOpenDelete(false);
                 }}
                className="deleteBtn"
              >
                Delete Room
              </button>
              {/* the cancel model button */}
              <button className="cancelBtn" onClick={() => setIsOpenDelete(false)}>
                Cancel
              </button>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteRoomModal;
