//import packages
import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

//import actions
import rooms, { addRoom } from "../../redux/reducers/rooms";
import { setCategories } from "../../redux/reducers/categories";

//import styling
import "./CreateNewRoomModals.css";

//import component
import SingleCategory from "./SingleCategory";

export const CreateNewRoomModal = (props) => {
  const { setIsOpen } = props;

  const [imgUrl, setImgUrl] = useState("");

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [chooseCategory, setChooseCategory] = useState("");

  //*=================================================================================

  const dispatch = useDispatch();

  const { token, categories } = useSelector((state) => {
    return { token: state.auth.token, categories: state.categories.categories };
  });
  //*=================================================================================

  const createRoom = (e, categoryId) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/categories/${categoryId}/rooms`,
        { name, room_image: imgUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(addRoom(result.data.room));
        setMessage(result.data.message);
        setIsOpen(false);
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

  const uploadImage = (image_data) => {
    console.log("asdasd ASDAS ASD ASD " ,image_data );
    const data = new FormData();
    data.append("file", image_data);
    data.append("upload_preset", "merakie");
    data.append("cloud_name", "dkqqtkt3b");
    fetch("https://api.cloudinary.com/v1_1/dkqqtkt3b/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setImgUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

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
                  <RiCloseLine
                    className="closeIcon"
                    style={{ marginBottom: "-3px" }}
                  />
                </button>

                <div className="modalContent">
                  {/* ///////////////////////////////the body f the model */}
                  You Can Create New Room
                  <div className="push-down"></div>
                  <form>
                    <input
                      className="createField"
                      type={"text"}
                      placeholder="Create Room"
                      onChange={(e) => setName(e.target.value)}
                    />

                    {categoriesList && (
                      <div>
                        <label className="NameCategory" htmlFor="categories">
                          Choose a Category Type And a Photo:
                        </label>
                        <div className="push-downSelect">
                          <select
                            id="categories"
                            className="selector"
                            onChange={(e) => setChooseCategory(e.target.value)}
                          >
                            <option value="">Choose A Category</option>

                            {categoriesList}
                          </select>
                          <input
                            type={"file"}
                            onChange={(e) => {
                              uploadImage(e.target.files[0]);
                            }}
                            className="update-account"
                            id="file"
                          />
                          <label htmlFor="file" className="chooseRoomBtnCreate">
                            Choose a photo
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="push-downCreate">
                      {/* the create button */}
                      <button
                        className="createBtnRoom"
                        onClick={(e) => {
                          createRoom(e, chooseCategory);
                        }}
                      >
                        Create New Room
                      </button>
                      {/* the cancel model button */}
                      <button
                        className="cancelBtnRoom"
                        onClick={() => {
                          setMessage("");
                          setIsOpen(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                    <p>{message}</p>
                  </form>
                </div>

                {/* // ... */}
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};
