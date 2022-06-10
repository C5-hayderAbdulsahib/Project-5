import { createSlice } from "@reduxjs/toolkit";

//i also will have to export the authSlice or it will not work
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    //this is the initial data to the state and it is the same as the initial data that is used in the normal state useState("");
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("token") ? true : false,
  },

  reducers: {
    signin: (state, action) => {
      //action is an object and it contains two values {type,payload:""} the payload is a token with a string datatype
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.token = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload);
      // console.log(action);
      // console.log(state);
    },

    logout: (state, action) => {
      //action is an object and it contains two values {type, no payload}
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.token = "";
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdminPage");
      // console.log(action);
    },
  },
});

// action creator functions are generated for each case reducer function
// action creator is a function that creates an action which is an object that has 2 keys type and payload, the type is used to identify what the reducer is supposed to do, and the payload is the information that the reducer will use to complete the process.
export const { signin, logout } = authSlice.actions;

export default authSlice.reducer;
