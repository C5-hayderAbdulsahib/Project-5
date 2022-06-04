//import packages
import React, { useState } from "react";

//import components
import UpdateCategoryModal from "./UpdateCategoryModal";

const SingleCategory = (props) => {
  const { name, id, setUpdateName, updateCategoryFun, deleteCategoryFun } =
    props; //we used destructuring to make it easier to use them

  const [isOpen, setIsOpen] = useState(false); //the reason that we created this state is for showing or hiding the model

  return (
    <>
      <p>{name}</p>

      {/* the model component */}
      {/* we make a condition if the state is false then dont show the model else show it */}
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

      <button onClick={() => setIsOpen(true)}>update</button>

      <button
        onClick={() => {
          deleteCategoryFun(id);
        }}
      >
        delete
      </button>
      <hr></hr>
    </>
  );
};

export default SingleCategory;
