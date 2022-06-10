//import styling
import "./UpdateCategoryModal.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

const UpdateCategoryModal = (props) => {
  const {
    name,
    setUpdateName,
    updateCategoryFun,
    id,
    // logout,
    setIsOpen,
    // token,
  } = props;

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="UpdateCategoryModal">
        <div className="darkBG" onClick={() => setIsOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Update a category</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>

            <div className="modalContent">
              {/* ///////////////////////////////the body f the model */}
              Are you sure you want to update the name of this category?
              <div className="push-down"></div>
              <form>
                <input
                  className="Update-Category"
                  type={"text"}
                  placeholder="Update Category"
                  defaultValue={name}
                  onChange={(e) => setUpdateName(e.target.value)}
                />
                <div className="push-down"></div>
                {/* the update button */}

                <div className="shiftingToLeft">
                  <button
                    onClick={(e) => {
                      updateCategoryFun(e, id);
                      setIsOpen(false);
                    }}
                    className="updateBtn"
                  >
                    Update Category
                  </button>
                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCategoryModal;
