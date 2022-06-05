import { configureStore } from "@reduxjs/toolkit";

// import the reducer
import authReducer from "./reducers/auth";
import categoriesReducer from "./reducers/categories";
import roomsReducer from "./reducers/rooms";

export default configureStore({
  reducer: {
    // add the reducers to the store
    auth: authReducer,
    categories: categoriesReducer,
    rooms: roomsReducer,
  },
});
