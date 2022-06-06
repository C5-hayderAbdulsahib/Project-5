//import packages
import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

//import actions
import { addRoom } from "../../redux/reducers/rooms";
import { setCategories } from "../../redux/reducers/categories";

//import styling
import "./style.css";

//import component
import SingleCategory from "./SingleCategory";

export const CreateNewRoomModal = (props) => {
  const { setIsOpen } = props;

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [chooseCategory, setChooseCategory] = useState("");

  //*=================================================================================

  const dispatch = useDispatch();

  const { token, categories } = useSelector((state) => {
    return { token: state.auth.token, categories: state.categories.categories };
  });
  //*=================================================================================

  const createRoom = (categoryId = 1) => {
    axios
      .post(
        `http://localhost:5000/categories/${categoryId}/rooms`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(addRoom(result.data.room));
        setMessage(result.data.message);
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Get Data, please try again");
      });
  };

  const chooseCategoryFun = () => {
    axios
      .get(`http://localhost:5000/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(setCategories(result.data.categories));
      })
      .catch((err) => {
        if (!err.response.data.success) {
          return setMessage(err.response.data.message);
        }
        setMessage("Error happened while Get Data, please try again");
      });
  };

  useEffect(() => {
    chooseCategoryFun();
  }, []);

  let categoriesList;
  if (categories) {
    categoriesList = categories?.map((element) => {
      return (
        <SingleCategory key={element.id} name={element.name} id={element.id} />
      ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it has to be unique or an error will also occur so that why we usually  give it the value of the index, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
    });
  }

  //*=================================================================================

  return (
    <>
      <div>
        <div>
          <>
            {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
            <div
              className="darkBG"
              onClick={() => {
                setIsOpen(false);
              }}
            />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Dialog</h5>
                </div>
                <button
                  className="closeBtn"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>

                <div className="modalContent">
                  {/* ///////////////////////////////the body f the model */}
                  You Can Create New Room
                  <div className="push-down"></div>
                  <input
                    type={"text"}
                    placeholder="Create Room"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="push-down"></div>
                  {categoriesList && (
                    <>
                      <label htmlFor="categories">
                        Choose a Category Type:
                      </label>

                      <select
                        id="categories"
                        onChange={(e) => setChooseCategory(e.target.value)}
                      >
                        <option value="">Choose A Type</option>

                        {categoriesList}
                        {/* {categories.map((element) => {
                          return (
                            <>
                              <option value={element.id}>{element.name}</option>
                            </>
                          );
                        })} */}
                      </select>
                    </>
                  )}
                  <div className="push-down"></div>
                  {/* the update button */}
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      createRoom(chooseCategory);
                    }}
                  >
                    Create New Room
                  </button>
                  {/* the cancel model button */}
                  <button
                    className="cancelBtn"
                    onClick={() => {
                      setMessage("");
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <p>{message}</p>
                </div>

                {/* // ... */}
              </div>
            </div>
          </>

          {/* <button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            create room
          </button> */}
        </div>
      </div>
    </>
  );
};
