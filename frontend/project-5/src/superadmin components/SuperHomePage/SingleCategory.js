//import packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//import style
import "./SingleCategory.css";

const SingleCategory = (props) => {
  const { name, id } = props; //we used destructuring to make it easier to use them

  const navigate = useNavigate();
  return (
    <>
      <div
        className="categoryelemnt"
        onClick={() => {
          navigate(`/super_admin/home/categories/${id}`);
        }}
      >
        <div>
          <p
            className="categoryName"
            onClick={() => {
              navigate(`/super_admin/home/categories/${id}`);
            }}
          >
            {name}
          </p>
        </div>
      </div>
    </>
  );
};

export default SingleCategory;
