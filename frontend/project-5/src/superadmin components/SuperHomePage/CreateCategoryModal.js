import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addCategory } from "../../redux/reducers/categories/index";
import axios from "axios";

//import style
import "./CreateCategoryModal.css";

//import icons
import { IoMdAdd } from "react-icons/io";

const CreateCategoryModal = (props) => {
  const dispatch = useDispatch("");
  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });
  //======================================================================================================

  const { setIsOpenCreateCategory } = props;
  const [name, setName] = useState("");

  //======================================================================================================

  //Create Category
  const createCategory = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result.data.success) {
          dispatch(addCategory(result.data.category));
          setIsOpenCreateCategory(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //======================================================================================================

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="CreateCategoryModal">
        <div
          className="darkBG"
          onClick={() => setIsOpenCreateCategory(false)}
        />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Create a category</h5>
            </div>
            <button
              className="closeBtn"
              onClick={() => setIsOpenCreateCategory(false)}
            >
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </button>

            <div className="modalContent">
              <div className="fixed-width">
                {/* ///////////////////////////////the body f the model */}
                You can create a new category
                <div className="push-down"></div>
                <form>
                  <div className="Category-label">
                    <label>Category Name</label>
                  </div>
                  <input
                    className="Create-Category"
                    type={"text"}
                    placeholder="Create Category"
                    onChange={(e) => setName(e.target.value)}
                  />
                  {/* the update button */}
                  <div className="shiftingToLeft">
                    <button className="createBtn" onClick={createCategory}>
                      Create Category <IoMdAdd />
                    </button>

                    {/* the cancel model button */}
                    <button
                      className="cancelBtn"
                      onClick={() => {
                        setIsOpenCreateCategory(false);
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

export default CreateCategoryModal;
