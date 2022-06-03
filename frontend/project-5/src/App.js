//importing packages
import { Routes, Route } from "react-router-dom";

//import components
import SuperSigninPage from "./superadmin components/SuperSigninPage"; //since the file inside the Register has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import { SigninPage } from "./user components/SigninPage"; //since we used export directly then we have to use the {} when importing
import { SignupPage } from "./user components/SignupPage"; //since we used export directly then we have to use the {} when importing
import HomePage from "./user components/HomePage";
import Navbar from "./user components/Navbar";

//styling
import "./App.css";

function App() {
  return (
    // this is for testing
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/super_admin/signin" element={<SuperSigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path={"/"} element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
