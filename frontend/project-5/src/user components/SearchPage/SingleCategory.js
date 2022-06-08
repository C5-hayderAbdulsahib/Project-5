//import packages
import React, { useState } from "react";

const SingleCategory = (props) => {
  const { name, id } = props; //we used destructuring to make it easier to use them

  return (
    <>
      <option value={id}>{name}</option>
    </>
  );
};

export default SingleCategory;
