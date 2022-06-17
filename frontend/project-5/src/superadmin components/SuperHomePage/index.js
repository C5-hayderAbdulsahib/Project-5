//import packages
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

//import style
import "./style.css";

//import icons
import { BsFillPersonPlusFill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";

//import actions
import { setCategories } from "../../redux/reducers/categories";
import { isAdminPage } from "../../redux/reducers/user";
import { logout } from "../../redux/reducers/auth";

//import Components
import SingleCategory from "./SingleCategory";
import CreateCategoryModal from "./CreateCategoryModal";
import CreateNewAdminModel from "./CreateNewAdminModel";

import RightThisCategory from "./RightThisCategory";

//import styling
import "./style.css";

const SuperHomePage = () => {
  const dispatch = useDispatch("");
  const navigate = useNavigate();

  //======================================================================================================

  const { token, categories } = useSelector((state) => {
    return {
      token: state.auth.token,
      categories: state.categories.categories,
      isLoggedIn: state.auth.isLoggedIn,
    };
  });

  const [message, setMessage] = useState("");
  const [isOpenCreateCategory, setIsOpenCreateCategory] = useState(false);
  const [isOpenAdmin, setIsOpenAdmin] = useState(false);
  //======================================================================================================
  /////////getAllCategories/////////////

  const getAllCategories = () => {
    axios
      .get(`http://localhost:5000/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        if (result.data.success) {
          dispatch(setCategories(result.data.categories));
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };
  //======================================================================================================

  useEffect(() => {
    if (!token) {
      navigate("/super_admin/signin");
    }

    dispatch(isAdminPage("this is super admin page"));
    getAllCategories();
  }, []);

  //the reason the we render each single element in another component is for performance wise
  const categoriesList = categories?.map((element) => {
    return (
      <SingleCategory key={element.id} name={element.name} id={element.id} />
    ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it has to be unique or an error will also occur so that why we usually  give it the value of the index, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
  });

  return (
    <>
      <div className="superadminMain">
        <div className="left-all-categories">
          <div className="superNav">
            <h1 className="superTitle">super home admin</h1>

            <Link to="/super_admin/signin">
              <button
                className="logOut"
                onClick={() => {
                  dispatch(logout()); //send the action to the reducer using dispatch
                }}
              >
                Logout
              </button>
            </Link>
          </div>

          <div className="display-grid-super-admin">
            <div className="superLeftSide">
              <div className="categoryButtonMain">
                <button
                  onClick={() => {
                    setIsOpenCreateCategory(true);
                  }}
                  className="CreateCategoryBtn"
                >
                  Create Category <IoMdAdd />
                </button>
                <br></br>
                <button
                  onClick={() => {
                    setIsOpenAdmin(true);
                  }}
                  className="CreateCategoryAdminBtn"
                >
                  Create New Admin <BsFillPersonPlusFill />
                </button>
              </div>
              {/* {message ? <p>{message}</p> : ""} */}

              <div className="CategoryBody">
                {categories.length && categoriesList}
              </div>
            </div>
            <div className="right-side-this-Category">
              <Routes>
                <Route path="/categories/:id" element={<RightThisCategory />} />
              </Routes>
            </div>
          </div>
        </div>

        {isOpenCreateCategory && (
          <CreateCategoryModal
            setIsOpenCreateCategory={setIsOpenCreateCategory}
          />
        )}
        {isOpenAdmin && <CreateNewAdminModel setIsOpenAdmin={setIsOpenAdmin} />}
      </div>
    </>
  );
};

export default SuperHomePage;
