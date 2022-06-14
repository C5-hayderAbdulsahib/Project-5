


//import packages
import React, { useState } from "react";

//importing css
import "./style.css";


const SingleRoom = (props) => {
  const { room } = props; //we used destructuring to make it easier to use them

  //   return <h1>{room.username}</h1>;

  return (
    <>
      <h1>{room.name}</h1>

      <p>this is a group room</p>
      <hr></hr>
    </>
  );
};

export default SingleRoom;
