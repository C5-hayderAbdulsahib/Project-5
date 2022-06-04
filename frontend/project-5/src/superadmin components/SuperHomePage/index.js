//import packages
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//import actions
import {
  addCategory,
  setCategories,
  updateCategory,
  deleteCategory,
} from "../../redux/reducers/categories";

//import Components
import SingleCategory from "./SingleCategory";

const SuperHomePage = () => {
  const dispatch = useDispatch("");

  const navigate = useNavigate();

  const { token, categories } = useSelector((state) => {
    return { token: state.auth.token, categories: state.categories.categories };
  });

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [updateName, setUpdateName] = useState("");
  ///////////createCategory////////////////////

  const createCategory = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        if (result.data.success) {
          setMessage(result.data.message);
          dispatch(addCategory(result.data.category));
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  };

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
    //===============================================

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
  console.log("the testing is");

  //the reason the we render each single element in another component is for performance wise
  const categoriesList = categories?.map((element) => {
    console.log("the unique index is", element.id);
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
      <h1>super home admin</h1>
      <div>
        <form onSubmit={createCategory}>
          <input
            type={"text"}
            placeholder="Category Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>

          <button>Create Category</button>
          <br></br>

          {message ? <p>{message}</p> : ""}
        </form>

        <div>
          {categoriesList && categoriesList}
          {/* {categories &&
            categories.map((element, index) => {
              return (
                <div key={index}>
                  <p>{element.name}</p>
                  <input
                    type={"text"}
                    onChange={(e) => {
                      setUpdateName(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      updateCategoryFun(element.id);
                    }}
                  >
                    update
                  </button>
                  <button
                    onClick={() => {
                      deleteCategoryFun(element.id);
                    }}
                  >
                    delete
                  </button>
                  <hr></hr>
                </div>
              );
            })} */}
        </div>
      </div>
    </>
  );
};

export default SuperHomePage;
