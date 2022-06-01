const express = require("express");
const { signup ,signIn} = require("../controllers/users");

//===================================================
const usersRouter = express.Router();

usersRouter.post("/signup", signup);
usersRouter.post("/signIn", signIn);
module.exports = usersRouter;
