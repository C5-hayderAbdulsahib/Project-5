const express = require("express");
const { signup ,signIn,getAllUsernames} = require("../controllers/users");

//===================================================
const usersRouter = express.Router();

usersRouter.post("/signup", signup);
usersRouter.post("/signIn", signIn);
usersRouter.get("/usernames", getAllUsernames);

module.exports = usersRouter;
