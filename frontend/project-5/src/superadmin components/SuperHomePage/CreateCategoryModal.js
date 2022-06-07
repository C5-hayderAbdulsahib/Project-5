import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addCategory } from "../../redux/reducers/categories/index";
import axios from "axios";

const CreateCategoryModal = (props) => {
  const dispatch = useDispatch("");
  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });
  //======================================================================================================

  const { setIsOpen } = props;
  const [name, setName] = useState("");

  //======================================================================================================

  //Create Category
  const createCategory = () => {
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
        }
      })
      .catch(err=>{
          console.log(err);
      });
  };

  //======================================================================================================

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="super-admin-modal">
      
      
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
            You Can Create New Category
            <div className="push-down"></div>
            <form
              onSubmit={() => {
                setIsOpen(false);
              }}
            >
              <input
                type={"text"}
                placeholder="Create Category"
                onChange={(e) => setName(e.target.value)}
              />
              <div className="push-down"></div>
              {/* the update button */}
              <button
                // onClick={() => {
                //   updateCategoryFun(id);
                //   setIsOpen(false);
                // }}
                className="createBtn"
                onClick={ createCategory  }
              >
                Create Category
              </button>
              {/* the cancel model button */}
              <button
                className="cancelBtn"
                onClick={() => {
                  setIsOpen(false);
                }}
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

export default CreateCategoryModal;
