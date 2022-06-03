const express = require("express");

//controllers

const { createNewRole } = require("../controllers/roles");

const roleRouter = express.Router();

roleRouter.post("/", createNewRole);

module.exports = roleRouter;
