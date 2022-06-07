//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//importing css
import "./style.css";

const SearchPage = () => {
  const { token } = useSelector((state) => {
    return { token: state.auth.token };
  });

  const navigate = useNavigate();

  const [groupRooms, setGroupRooms] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);

  const [errMessage, setErrMessage] = useState("");

  const [inputSearch, setInputSearch] = useState("");
  const [categoriesSearch, setCategoriesSearch] = useState("");

  //   http://localhost:5000/users/usernames
  //   http://localhost:5000/rooms/group
  const getAllGroupRoomsFun = () => {
    axios
      .get(`http://localhost:5000/rooms/group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.rooms);
        setGroupRooms(result.data.rooms);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
      });
  };

  const getAllUserNamesFun = () => {
    axios
      .get(`http://localhost:5000/users/usernames`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result.data.users);
        setGroupRooms(result.data.users);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
      });
  };

  //we used map to iterate over the array and send data as a prop to the single item component
  let roomsList = [];

  //the first iteration is used to search depending on the input search bar to search by title or category or country
  if (inputSearch) {
    roomsList = allUserNames
      .filter((element) => {
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        return (
          element.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
          element.country.toLowerCase().includes(inputSearch.toLowerCase()) ||
          element.category_id.name
            .toLowerCase()
            .includes(inputSearch.toLowerCase())
        );
      })
      .map((element) => {
        //we created this part in order to view the date as a string and not a number
        const createdJobDate = new Date(element.createdAt)
          .toString()
          .substring(4, 10);

        // return (
        //   <SingleJob key={element._id} job={element} jobDate={createdJobDate} />
        // ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }

  if (categoriesSearch) {
    roomsList = groupRooms
      .filter((element) => {
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        return element.category_id.name
          .toLowerCase()
          .includes(categoriesSearch.toLowerCase());
      })
      .map((element) => {
        // console.log("the unique index is", element._id);

        //we created this part in order to view the date as a string and not a number
        const createdJobDate = new Date(element.createdAt)
          .toString()
          .substring(4, 10);

        // return (
        //   <SingleJob key={element._id} job={element} jobDate={createdJobDate} />
        // ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }

  //the reason that i add the navigate because if the user was not logged in then redirect him to the signin page
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      getAllGroupRoomsFun();
      getAllUserNamesFun();
    }
  }, []);

  return (
    <>
      {groupRooms.length || allUserNames.length ? (
        <>
          <div>
            <div>
              <label htmlFor="search-bar">Search By Text:</label>
              <input
                type={"text"}
                id="search - bar"
                placeholder={"Search By Room"}
                onChange={(e) => {
                  setInputSearch(e.target.value);
                  categoriesSearch("");
                }}
              />
            </div>

            {/* <div className="search-country">
              <label htmlFor="country">Search By Country:</label>
              <Select
                name="country"
                id="country"
                options={allCountries}
                defaultValue={{ value: "", label: "Select A Category" }}
                onChange={(e) => {
                  categoriesSearch(e.label);
                  setInputSearch("");
                }}
                className="react-select"
              />
            </div> */}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default SearchPage;
