//import packages
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//import components
import SingleGroupRoom from "./SingleGroupRoom";
import SingleCategory from "./SingleCategory";
import SingleSearchResult from "./SingleSearchResult";

//importing css
import "./style.css";

// import icons
import { FaSearch } from "react-icons/fa";

//import actions
import { setCategories } from "../../redux/reducers/categories";
import { getAllMyRooms } from "../../redux/reducers/rooms";

const SearchPage = () => {
  const { token, categories } = useSelector((state) => {
    return { token: state.auth.token, categories: state.categories.categories };
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [groupRooms, setGroupRooms] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);

  const [errMessage, setErrMessage] = useState("");

  const [inputSearch, setInputSearch] = useState("");
  const [categoriesSearch, setCategoriesSearch] = useState("");

  //we add this state to bring the the categories to add it to the dropdown select category
  const [chooseCategory, setChooseCategory] = useState("");

  const [renderPage, setRenderPage] = useState(false);

  const getAllGroupRoomsFun = () => {
    axios
      .get(`http://localhost:5000/rooms/group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        // console.log(result.data.rooms);
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
        // console.log(result.data.users);
        setAllUserNames(result.data.users);
        setErrMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrMessage(err.response.data.message);
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
          return setErrMessage(err.response.data.message);
        }
        setErrMessage("Error happened while Get Data, please try again");
      });
  };

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

  let categoriesList;
  if (categories) {
    categoriesList = categories?.map((element) => {
      return (
        <SingleCategory key={element.id} name={element.name} id={element.id} />
      ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it has to be unique or an error will also occur so that why we usually  give it the value of the index, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
    });
  }

  //we used map to iterate over the array and send data as a prop to the single item component
  let roomsList = [];

  //the first iteration is used to search depending on the input search bar to search by title or category or country
  if (inputSearch) {
    const concatArray = groupRooms.concat(allUserNames);

    roomsList = concatArray
      .filter((element) => {
        // console.log(element);
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        if (
          element?.username?.toLowerCase().includes(inputSearch.toLowerCase())
        ) {
          // console.log(element);
          return element;
        }
        if (element?.name?.toLowerCase().includes(inputSearch.toLowerCase())) {
          // console.log(element);
          return element;
        }
      })
      .map((element, index) => {
        // console.log(element);
        return (
          <SingleSearchResult
            key={index}
            search={element}
            renderPage={renderPage}
            setRenderPage={setRenderPage}
          />
        ); //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }

  if (chooseCategory) {
    roomsList = groupRooms
      .filter((element) => {
        //we add the filter to make the filtration but since our item will be view in another component thats why we add the map to send our component item by item to the other component that will view it, because using filter alone will not work because our return will be an array of the filtered item and that is not we want we want each item to be separated and not inside an array so that why we added that map to bring each array alone
        return element.category_id === +chooseCategory;
      })
      .map((element) => {
        return <SingleGroupRoom key={element.id} room={element} />; //the key has to be named that way and if we tried to change it and give it a name of id an error will appear on the console, and also it value has to be unique or an error will also occur so that why we usually  give it the value of the id, so if there is an array of element in jsx and they all have the same name for example <p> we have to give each one of them a key attribute or an error will appear
      });
  }
  // console.log(roomsList);

  //the reason that i add the navigate because if the user was not logged in then redirect him to the signin page
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else {
      getAllGroupRoomsFun();
      getAllUserNamesFun();
      chooseCategoryFun();
      getAllRooms();
    }
  }, [renderPage]);

  return (
    <>
      {/* the reason that we did not add length is because axios take somw time to execute then bothe of these data will have a null value */}
      {groupRooms || allUserNames || roomsList.length ? (
        <>
          <div className="search">
            <div className="result-search">
              <div className="input-search">
                <div className="byText">
                  {/*        <label htmlFor="search-bar">Search By Text:   </label> */}
                  <input
                    type={"text"}
                    id="search - bar"
                    placeholder={"Search By Room Name Or User Name"}
                    onChange={(e) => {
                      setChooseCategory("");
                      setInputSearch(e.target.value);
                    }}
                  />
                  <FaSearch className="BsSearch" />
                </div>

                <div className="byCategory">
                  <label htmlFor="categories">Search By Category:</label>
                  <select
                    id="categories"
                    onChange={(e) => {
                      setInputSearch("");
                      setChooseCategory(e.target.value);
                    }}
                  >
                    <option value="">Choose A Category</option>

                    {categoriesList}
                  </select>
                </div>
              </div>

              <div className="SingleSearchResult">{roomsList}</div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default SearchPage;
