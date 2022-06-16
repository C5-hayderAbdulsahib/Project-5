//import packages
import { useNavigate } from "react-router-dom";

//import styling
import "./DeleteCategoryModal.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";
import { BsTrashFill } from "react-icons/bs";
import "./DeleteCategoryModal.css";

const DeleteRoomBySuperAdmin = (props) => {
  const { setIsOpenDeleteRoom, id, name, deleteRoomFun } = props;


  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="DeleteCategoryModal">
        <div className="darkBG" onClick={() => setIsOpenDeleteRoom(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Delete a Room </h5>
            </div>
            <button
              className="closeBtn"
              onClick={() => setIsOpenDeleteRoom(false)}
            >
              <RiCloseLine
                className="exitIcon"
                style={{ marginBottom: "-3px" }}
              />
            </button>
            <div className="superAdmin">
              <div className="modalContent">
                {/* ///////////////////////////////the body f the model */}
                Are you sure you want to delete {name}?
                <div className="push-down"></div>
                {/* the delete button */}
                <div className="shiftingToLeft">
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      deleteRoomFun(id);
                      setIsOpenDeleteRoom(false);
                    }}
                  >
                    Delete Room <BsTrashFill />
                  </button>
                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => setIsOpenDeleteRoom(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* // ... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteRoomBySuperAdmin;
