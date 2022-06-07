//import styling
import "./style.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";
import { BsTrashFill } from "react-icons/bs";

const DeleteCategoryModal = (props) => {
  const {
    deleteCategoryFun,
    id,
    name,
    // logout,
    setIsOpenDelete,
    // token,
  } = props;

  return (
    <>
      
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="super-admin-modal">
      <div className="darkBG" onClick={() => setIsOpenDelete(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Delete a category     </h5>
          </div>
          <button className="closeBtn" onClick={() => setIsOpenDelete(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>

          <div className="modalContent">
            {/* ///////////////////////////////the body f the model */}
            Are you sure you want to delete {name}?
            <div className="push-down"></div>
            <form
              onSubmit={() => {
                deleteCategoryFun(id);
                setIsOpenDelete(false);
              }}
            >
              {/* the delete button */}
              <button className="deleteBtn">Delete Category <BsTrashFill/> </button>
              {/* the cancel model button */}
              <button
                className="cancelBtn"
                onClick={() => setIsOpenDelete(false)}
              >
                Cancel
              </button>
            </form>
          </div>

          {/* // ... */}
        </div>
      </div>

      </div>
    </>

  );
};

export default DeleteCategoryModal;
