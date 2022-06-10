//import packages
import React, { useState } from "react";

//import style
import "./SingleCategory.css";

//import components
import UpdateCategoryModal from "./UpdateCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

//import icons
import { GrUpdate } from "react-icons/gr";

const SingleCategory = (props) => {
  const { name, id, setUpdateName, updateCategoryFun, deleteCategoryFun } =
    props; //we used destructuring to make it easier to use them

  const [isOpen, setIsOpen] = useState(false); //the reason that we created this state is for showing or hiding the model
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  return (
    <>
      {/* the model component for update category */}
      {/* we make a condition if the state is false then don't show the model else show it */}
      {isOpen && (
        <UpdateCategoryModal
          name={name}
          setUpdateName={setUpdateName}
          updateCategoryFun={updateCategoryFun}
          id={id}
          // logout={logout}
          setIsOpen={setIsOpen} //the reason that we send this state is to be able to close the model in the model component
          // token={token}
        />
      )}

      {/* the model component for delete category */}
      {isOpenDelete && (
        <DeleteCategoryModal
          deleteCategoryFun={deleteCategoryFun}
          id={id}
          name={name}
          // logout={logout}
          setIsOpenDelete={setIsOpenDelete} //the reason that we send this state is to be able to close the model in the model component
          // token={token}
        />
      )}
      <div className="categoryelemnt">
        <div>
          <p className="categoryName">{name}</p>
        </div>

        <div className="categoryBtn">
          <button onClick={() => setIsOpen(true)} className="UpdateCategoryBtn">
            Update
          </button>

          <button
            onClick={() => setIsOpenDelete(true)}
            /*   onClick={() => {
          deleteCategoryFun(id);
        }} */
            className="DeleteCategoryBtn"
          >
            Delete
          </button>
        </div>
      </div>
      <hr></hr>
    </>
  );
};

export default SingleCategory;
