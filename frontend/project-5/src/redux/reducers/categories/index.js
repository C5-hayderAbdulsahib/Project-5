import { createSlice } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    //this is the initial data to the state and it is the same as the initial data that is used in the normal state useState("");
    categories: [],
  },

  reducers: {
    setCategories: (state, action) => {
      //action is an object and it contains two values {type,payload:[]}
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.categories = action.payload;
      //   console.log(action);
    },

    addCategory: (state, action) => {
      //action is an object and it contains two values {type,payload:{}}
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.categories.push(action.payload);
         console.log(action);
    },

    updateCategory: (state, action) => {
      //action is an object and it contains two values {type,payload:{id, categoryName}}
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects
      state.categories = state.categories.map((element) => {
        if (element.id === action.payload.id) {
          return {
            ...element, //the reason that i added this part is to only updated the wanted data so i will not have to write other properties like the id or is_deleted or foreign keys  or the need to send those extra data with the dispatch, and the way that it work is that first it will spread the object into all of it properties and add the new updated value so it will be something like this {id:id, title: oldTitle, description: oldDescription, title: newTitle, description: newDescription } but in javascript there can not be two key with the same name so they will be override so the new object will be {id:id, title: newTitle, description: newDescription } and the order is very important so it has to be the spread element first then the new data and if we switch their places then the code will not work
            name: action.payload.name,
          };
        } else {
          return element;
        }
      });
      console.log(action.payload);
    },

    deleteCategory: (state, action) => {
      //action is an object and it contains two values {type,payload: id}
      // payload is can be data that will be sent from the form using the dispatch so the expected data will be either an object or an array of object, or it can be the data that came when the user click on a button so it might be an id or might be an object or an array of objects

      // filter will return a list of all element except for the one with the matching id
      state.categories = state.categories.filter((element) => {
        // the payload in this case is the id
        return element.id !== action.payload;
      });
      // console.log(action);
    },
  },
});

// action creator functions are generated for each case reducer function
// action creator is a function that creates an action which is an object that has 2 keys type and payload, the type is used to identify what the reducer is supposed to do, and the payload is the information that the reducer will use to complete the process.
export const { setCategories, addCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
