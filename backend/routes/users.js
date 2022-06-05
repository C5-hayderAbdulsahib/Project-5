const express = require("express");

const {
  signup,
  signIn,
  getAllUsernames,
  getUserInfo,
  updateUserInfo,
  createNewAdmin,
} = require("../controllers/users");

////////////Middleware////////
const authentication = require("../middleware/authentication");

//===================================================
const usersRouter = express.Router();
usersRouter.get("/", authentication, getUserInfo);
usersRouter.post("/signup", signup, signIn);
usersRouter.post("/signIn", signIn);
usersRouter.get("/usernames", authentication, getAllUsernames);
usersRouter.post(`/signup/superadmin`, createNewAdmin);
usersRouter.put(`/change_info`, authentication, updateUserInfo);
module.exports = usersRouter;
