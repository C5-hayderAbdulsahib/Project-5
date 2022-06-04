//import styling
import "./style.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

const DeleteCategoryModal = (props) => {
  const {

    deleteCategoryFun,
    id,
    // logout,
    setIsOpen,
    // token,
  } = props;

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Dialog</h5>
          </div>
          <button className="closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>

          <div className="modalContent">
            {/* ///////////////////////////////the body f the model */}
            Are you sure you want to delete this category?
            <div className="push-down"></div>
            <form
              onSubmit={() => {
                deleteCategoryFun(id);
                setIsOpen(false);
              }}
            >
          
               {/* the delete button */}
              <button
             
                className="deleteBtn"
              >
                Delete Category
              </button>
              {/* the cancel model button */}
              <button className="cancelBtn" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </form>
          </div>

          {/* // ... */}
        </div>
      </div>
    </>
  );
};

export default DeleteCategoryModal;

