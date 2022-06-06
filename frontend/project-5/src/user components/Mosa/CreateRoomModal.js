import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRoom } from "../../redux/reducers/rooms";
import { RiCloseLine } from "react-icons/ri";
//*==============================================================================================================

// create model to create new room
export const CreateRoomModal = () => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  //*=================================================================================

  const dispatch = useDispatch();
  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });
  //*=================================================================================

  const createRoom = (id = 1) => {
    axios
      .post(
        `http://localhost:5000/categories/${id}/rooms`,
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
        setMessage(err.response.data.message);
      });
  };

  //*=================================================================================

  return (
    <>
      <div>
        <div>
          <p>create room</p>

          {isOpen && (
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
                    {/* the update button */}
                    <button
                      // onClick={() => {
                      //   updateCategoryFun(id);
                      //   setIsOpen(false);
                      // }}
                      className="deleteBtn"
                      onClick={() => {
                        createRoom(1);
                      }}
                    >
                      Create Room
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
          )}
          <button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            create room
          </button>
        </div>
      </div>
    </>
  );
};
