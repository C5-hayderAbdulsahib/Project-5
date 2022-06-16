//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//import components
import UpdateCategoryModal from "./UpdateCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

//import icons
import { IoIosCreate } from "react-icons/io";
import { BsTrashFill } from "react-icons/bs";

//import actions
import {
  updateCategory,
  deleteCategory,
} from "../../redux/reducers/categories";
import { deleteRoom } from "../../redux/reducers/rooms";

// import css

import "./RightThisCategory.css";

const RightThisCategory = () => {
  const dispatch = useDispatch("");
  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  const [errMessage, setErrMessage] = useState("");
  const [category, setCategory] = useState("");
  const [roomsCategory, setRoomsCategory] = useState([]);

  const [isOpen, setIsOpen] = useState(false); //the reason that we created this state is for showing or hiding the model
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [updateName, setUpdateName] = useState("");

  const [renderPage, setRenderPage] = useState(false);

  // `useParams` returns an object that contains the URL parameters
  const { id } = useParams();

  const navigate = useNavigate();

  const getCategoryByIdFun = () => {
    axios
      .get(`http://localhost:5000/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.category);
        setCategory(result.data.category);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
      });
  };

  const updateCategoryFun = (e, id) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:5000/categories/${id}`,
        { name: updateName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(updateCategory({ id, name: updateName }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteCategoryFun = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:5000/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(deleteCategory(id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllRoomsForThisCategoryFun = () => {
    axios
      .get(`http://localhost:5000/categories/${id}/get_all_of_it_rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.rooms);
        setRoomsCategory(result.data.rooms);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
      });
  };

  const deleteRoomFun = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:5000/rooms/${id}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(deleteRoom(id));
        setRenderPage(!renderPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //the reason that i add the navigate because if the user was not logged in then redirect him to the signin page
  useEffect(() => {
    if (!token) {
      navigate("/super_admin/signin");
    } else {
      getCategoryByIdFun();
      getAllRoomsForThisCategoryFun();
    }
  }, [id, renderPage]); //the reason the i added the renderPage is because the get room by id came from the backend and it does not have a action in redux so it only have local state thats why i added the renderPage in order to make useEffect rerender the page again on update or delete

  return (
    <>
      {!errMessage ? (
        <>
          {/* the model component for update category */}
          {/* we make a condition if the state is false then don't show the model else show it */}
          {isOpen && (
            <UpdateCategoryModal
              name={category.name}
              setUpdateName={setUpdateName}
              updateCategoryFun={updateCategoryFun}
              id={id}
              setIsOpen={setIsOpen} //the reason that we send this state is to be able to close the model in the model component
              setRenderPage={setRenderPage}
              renderPage={renderPage}
            />
          )}

          {/* the model component for delete category */}
          {isOpenDelete && (
            <DeleteCategoryModal
              deleteCategoryFun={deleteCategoryFun}
              id={id}
              name={category.name}
              setIsOpenDelete={setIsOpenDelete} //the reason that we send this state is to be able to close the model in the model component
            />
          )}
          <div>
            <div className="categoryelemntNav">
              <div className="categoryBtn">
                <div>{category.name}</div>

                <button
                  onClick={() => setIsOpen(true)}
                  className="UpdateCategoryBtn"
                >
                  Update <IoIosCreate />
                </button>

                <button
                  onClick={() => setIsOpenDelete(true)}
                  className="DeleteCategoryBtn"
                >
                  Delete <BsTrashFill />
                </button>
              </div>
            </div>

            <div className="superAdminRoomContainer">
              {roomsCategory?.map((element) => {
                return (
                  <div className="categoryContainer" key={element.id}>
                    <p className="categoryRoomName">{element.name}</p>

                    <button
                    className="categoryRoomDeleteBtn"
                      onClick={() => {
                        deleteRoomFun(element.id);
                      }}
                    >
                      delete Room
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div>{errMessage && <p>{errMessage}</p>}</div>
      )}
    </>
  );
};

export default RightThisCategory;
