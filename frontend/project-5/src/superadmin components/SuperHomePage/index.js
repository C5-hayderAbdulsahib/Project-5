import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, setCategories } from "../../redux/reducers/categories";

const SuperHomePage = () => {
  const dispatch = useDispatch("");
  const { token ,categories} = useSelector((state) => {
    return { token: state.auth.token, categories: state.categories.categories };
  });

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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
          console.log(result.data.category);
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
        console.log(categories);
        if (result.data.success) {
          dispatch(setCategories(result.data.categories));
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  useEffect(() => {
    getAllCategories();
  }, []);

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
        {categories &&
          categories.map((element, index) => {
            console.log(element);

         return   <div key={index}>
              <p>{element.name}</p>
              <button>update</button>
              <button>delete</button>
              <hr></hr>
            </div>;
          })}
          </div>
      </div>
    </>
  );
};

export default SuperHomePage;
