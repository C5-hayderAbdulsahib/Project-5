import { Link } from "react-router-dom";
import "./style.css";

//import useDispatch and useSelector to dispatch and subscribe to the store
import { useDispatch, useSelector } from "react-redux";

//import the actions
import { logout } from "../../redux/reducers/auth";

//===============================================================

const Navbar = () => {
  // useDispatch allows us to dispatch actions to the reducers
  const dispatch = useDispatch();

  // useSelector gives us access to the store
  const state = useSelector((state) => {
    // specify which state to subscribe to (state tree => reducer => state name )
    //the state inside the parameter refer to the store in the store.js and it will have all of it reducers and then we will access the wanted reducer and after that we want to access the wanted state inside that reducer
    return {
      isLoggedIn: state.auth.isLoggedIn, //state.auth.isLoggedIn ---> the first state is built in and it came from the function parameter the second auth is the name that we give to the reducer inside the store and the isLoggedIn is the name of the state itself and we give it this name inside the reducer file
    };
  });

  //===============================================================

  return (
    <>
      <div className="navbar">
        {state.isLoggedIn ? (
          <>
            <Link to="/">Home</Link>

            <Link to="/signin">
              <button
                onClick={() => {
                  dispatch(logout()); //send the action to the reducer using dispatch
                }}
              >
                Logout
              </button>
            </Link>

            <Link to="/rooms/search">Search</Link>
          </>
        ) : (
          ""
          // <>
          //   <Link to="/signup">Signup</Link>
          //   <Link to="/signin">Signin</Link>
          // </>
        )}
      </div>
    </>
  );
};

export default Navbar;
