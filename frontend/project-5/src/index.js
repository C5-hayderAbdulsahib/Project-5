import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

//this is for react routers
import { BrowserRouter as Router } from "react-router-dom";

// import Provider from redux package
import { Provider } from "react-redux";
// import the store from redux folder
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      {/* wrap the App with the Provider and pass the store, all the components that are nested in the Provider will have access to the store and can use it */}
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
