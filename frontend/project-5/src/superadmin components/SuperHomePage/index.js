//import packages
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//import actions
import {
  setCategories,
  updateCategory,
  deleteCategory,
} from "../../redux/reducers/categories";

//import Components
import SingleCategory from "./SingleCategory";
import CreateCategoryModal from "./CreateCategoryModal";
import CreateNewAdminModel from "./CreateNewAdminModel";

const SuperHomePage = () => {
  const dispatch = useDispatch("");
  const navigate = useNavigate();

  //======================================================================================================

  const { token, categories } = useSelector((state) => {
    return { token: state.auth.token, categories: state.categories.categories };
  });

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
    //======================================================================================================
  };
  const updateCategoryFun = (id) => {
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

  //======================================================================================================
  ////////////deleteCategory///////////////

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

  useEffect(() => {
    if (!token) {
      navigate("/super_admin/signin");
    }

    getAllCategories();
  }, []);

  //the reason the we render each single element in another component is for performance wise
  const categoriesList = categories?.map((element) => {
    return (
      <SingleCategory
        key={element.id}
        name={element.name}
        id={element.id}
        setUpdateName={setUpdateName}
        updateCategoryFun={updateCategoryFun}
        deleteCategoryFun={deleteCategoryFun}
      />
    ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it has to be unique or an error will also occur so that why we usually  give it the value of the index, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
  });

  return (
    <>
      {isOpen && <CreateCategoryModal setIsOpen={setIsOpen} />}
      {isOpenAdmin && <CreateNewAdminModel setIsOpenAdmin={setIsOpenAdmin} />}
      <h1>super home admin</h1>
      <div>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Create Category
        </button>
        <br></br>
        <button
          onClick={() => {
            setIsOpenAdmin(true);
          }}
        >
          Create New Admin
        </button>
        {message ? <p>{message}</p> : ""}

        <div>{categories.length && categoriesList}</div>
      </div>
    </>
  );
};

export default SuperHomePage;
