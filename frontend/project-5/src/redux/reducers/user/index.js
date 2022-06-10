import { createSlice } from "@reduxjs/toolkit";

//i also will have to export the authSlice or it will not work
export const userSlice = createSlice({
  name: "user",
  initialState: {
    //this is the initial data to the state and it is the same as the initial data that is used in the normal state useState("");
    user: JSON.parse(localStorage.getItem("user")) || {},
    adminPage: localStorage.getItem("isAdminPage") || "",
  },

  reducers: {
    getUserInfo: (state, action) => {
      //action is an object and it contains two values {type,payload:{}} the payload is a token with a string datatype
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      console.log(action);
    },

    isAdminPage: (state, action) => {
      //action is an object and it contains two values {type,payload:"this is super admin page"} the payload is a token with a string datatype
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.adminPage = action.payload;
      localStorage.setItem("isAdminPage", action.payload);
      console.log(action);
    },

    updateUserInfo: (state, action) => {
      //action is an object and it contains two values {type,payload:{...old properties, new properties}}
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      console.log(action.payload);
    },
  },
});

// action creator functions are generated for each case reducer function
// action creator is a function that creates an action which is an object that has 2 keys type and payload, the type is used to identify what the reducer is supposed to do, and the payload is the information that the reducer will use to complete the process.
export const { getUserInfo, isAdminPage, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
