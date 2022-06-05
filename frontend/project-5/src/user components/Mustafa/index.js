//import packages
import axios from "axios";
import { useEffect, useState } from "react";
 

//import actions



//import Components
import  DeleteRoomModal  from "./DeleteRoomModal";
import UpdateRoomModal from "./UpdateRoomModal";

const Mustafa = () => {
 

  //======================================================================================================

   
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [id, setId] = useState("");

/*   const deleteRoomFun = (id=1) => {
    axios
      .delete(`http://localhost:5000/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(deleteRoom(id));
      })
      .catch((err) => {
        console.log(err);
      });
  }; */

  return (
    <>
      {isOpenUpdate && <UpdateRoomModal setIsOpenUpdate={setIsOpenUpdate} />}

      <div>
        <button
          onClick={() => {
            setIsOpenUpdate(true);
          }}
        >
          Update
        </button>

        <br></br>
        <button
          onClick={() => {
            setIsOpenDelete(true);
          }}
        >
          Delete
        </button>


        {isOpenDelete && 
          <DeleteRoomModal
             setIsOpenDelete={setIsOpenDelete} 
           
        
          />
        }
  

        {message ? <p>{message}</p> : ""}
      </div>
    </>
  );
};

export default Mustafa;
