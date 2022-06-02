const express = require("express");

const { signup ,signIn,getAllUsernames} = require("../controllers/users");

////////////Middelware////////
const authentication = require("../middleware/authentication");

//===================================================
const usersRouter = express.Router();

usersRouter.post("/signup", signup);
usersRouter.post("/signIn", signIn);
usersRouter.get("/usernames",authentication, getAllUsernames);

module.exports = usersRouter;
