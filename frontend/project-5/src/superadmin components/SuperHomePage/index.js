import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../redux/reducers/categories";

const SuperHomePage = () => {
  const dispatch = useDispatch("");
  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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
      </div>
    </>
  );
};

export default SuperHomePage;
