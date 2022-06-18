import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//import actions

import { updateRoom } from "../../redux/reducers/rooms";

//import styling
import "./UpdateRoomModel.css";

//import icon from react icons
import { RiCloseLine } from "react-icons/ri";

export const UpdateRoomModel = (props) => {
  const {
    roomName,
    id,

    // logout,
    setIsOpenUpdate,
    renderPage,
    setRenderPage,
    // token,
  } = props;

  const [imgUrl, setImgUrl] = useState("");
  const [updateName, setUpdateName] = useState("");
  const dispatch = useDispatch("");

  //======================================================================================================

  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const UpdateRoomFun = (e, id) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:5000/rooms/${id}`,
        { name: updateName, room_image: imgUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(updateRoom({ id, name: updateName, room_image: imgUrl }));
        setRenderPage(!renderPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadImage = (image_data) => {
    console.log("this is image", image_data);
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

  return (
    <>
      {/* the onclick event that we add so that if the user click outside the model anywhere in the window it will close the model and we can remove this part if we want to */}
      <div className="UpdateRoomFun">
        <div className="darkBG" onClick={() => setIsOpenUpdate(false)} />
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              <h5 className="heading">Update Room</h5>
            </div>
            <button className="closeBtn" onClick={() => setIsOpenUpdate(false)}>
              <RiCloseLine
                className="closeIcon"
                style={{ marginBottom: "-3px" }}
              />
            </button>

            <div className="modalContent">
              {/* ///////////////////////////////the body f the model */}
              Are you sure you want to update the name of this Room?
              <div className="push-down"></div>
              <form
                onSubmit={(e) => {
                  UpdateRoomFun(e, id);
                  setIsOpenUpdate(false);
                }}
              >
                <input
                  type={"text"}
                  placeholder="Update Room"
                  defaultValue={roomName}
                  className="inputFieldUpdate"
                  onChange={(e) => setUpdateName(e.target.value)}
                />
                <div className="push-down">
                  {/* the update button */}
                  <input
                    type={"file"}
                    onChange={(e) => {
                      uploadImage(e.target.files[0]);
                    }}
                    className="update-account"
                    id="file1"
                  />
                  <label htmlFor="file1" className="chooseRoomBtn">
                    Choose a photo
                  </label>
                  <button
                    className="updateRoomBtn"
                    // onClick={(e) => {
                    //   UpdateRoomFun(e, id);
                    //   setIsOpenUpdate(false);
                    // }}
                  >
                    Update Room
                  </button>
                </div>
                {/* the cancel model button */}
                <button
                  className="cancelBtnUpdate"
                  onClick={() => setIsOpenUpdate(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
