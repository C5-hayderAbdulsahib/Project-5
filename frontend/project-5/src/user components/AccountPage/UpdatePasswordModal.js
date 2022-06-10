import { RiCloseLine } from "react-icons/ri";

const UpdatePasswordModal = (props) => {
  const { setIsOpen } = props;

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="CreateCategoryModal">
        <div className="darkBG" onClick={() => setIsOpen(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Create a category</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>

            <div className="modalContent">
              <div className="fixed-width">
                {/* ///////////////////////////////the body f the model */}
                You can create a new category
                <div className="push-down"></div>
                <form
                  onSubmit={() => {
                    setIsOpen(false);
                  }}
                >
                  {" "}
                  <div className="Category-label">
                    {" "}
                    <label>Category Name</label>
                  </div>
                  <input
                    className="Create-Category"
                    type={"text"}
                    placeholder="Create Category"
                  />
                  {/* the update button */}
                  <div className="shiftingToLeft">
                    {/* 
<div className="shiftingToLeft"> */}

                    <button
                      // onClick={() => {
                      //   updateCategoryFun(id);
                      //   setIsOpen(false);
                      // }}
                      className="createBtn"
                    >
                      Create Category
                    </button>

                    {/*  </div> */}
                    {/* the cancel model button */}
                    <button
                      className="cancelBtn"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* // ... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePasswordModal;
