import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { getAllMyRooms } from "../../redux/reducers/rooms";

//===============================================================================================================

//* cerate function to get all room that user created
export const GetAllMyRooms = () => {
  //============================================================
  const dispatch = useDispatch();
  const { token, rooms } = useSelector((state) => {
    return { token: state.auth.token, rooms: state.rooms.rooms };
  });
  //============================================================
  const getAllRooms = () => {
    axios
      .get(`http://localhost:5000/rooms/my_rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        dispatch(getAllMyRooms(result.data.rooms));
      });
  };
  //============================================================
  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <>
      <div>
        <div>
          <p>get my rooms</p>
          {rooms &&
            rooms.map((element) => {
              return (
                <div key={element.id}>
                  <p>{element.name}</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};
