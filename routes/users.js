const express = require("express");
const { signup } = require("../controllers/users");

//===================================================
const usersRouter = express.Router();

usersRouter.post("/signup", signup);

module.exports = usersRouter;
