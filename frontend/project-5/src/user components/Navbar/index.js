import { Link } from "react-router-dom";
import "./style.css";

//import useDispatch and useSelector to dispatch and subscribe to the store
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

//import the actions
import { logout } from "../../redux/reducers/auth";
import { CreateNewRoomModal } from "./CreateNewRoomModal";

//===============================================================

const Navbar = () => {
  // useDispatch allows us to dispatch actions to the reducers
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false); //this state is for showing the the create room model

  // useSelector gives us access to the store
  const state = useSelector((state) => {
    // specify which state to subscribe to (state tree => reducer => state name )
    //the state inside the parameter refer to the store in the store.js and it will have all of it reducers and then we will access the wanted reducer and after that we want to access the wanted state inside that reducer
    return {
      isLoggedIn: state.auth.isLoggedIn, //state.auth.isLoggedIn ---> the first state is built in and it came from the function parameter the second auth is the name that we give to the reducer inside the store and the isLoggedIn is the name of the state itself and we give it this name inside the reducer file
      user: state.user.user,
    };
  });

  //===============================================================

  return (
    <>
      {
        state.isLoggedIn && (
          <div className="navbar">
            <Link className="homeLink" to="/">
              Home
            </Link>
            <Link className="linkPage" to="/account_page">
              {state?.user?.username}
            </Link>

            <Link className="linkPage" to="/rooms/search">
              Search
            </Link>

            <Link className="linkPage" to="/account_page">
              User Profile
            </Link>
            <Link
              className="linkPage"
              to={"#"}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Create Room
            </Link>
            <Link
              className="linkPage"
              to="/signin"
              onClick={() => {
                dispatch(logout()); //send the action to the reducer using dispatch
              }}
            >
              Logout
            </Link>
            {isOpen && <CreateNewRoomModal setIsOpen={setIsOpen} />}
          </div>
        )

      
      }
    </>
  );
};

export default Navbar;
