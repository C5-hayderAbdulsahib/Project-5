const express = require("express");

const messagesRouter = express.Router;

const authentication = require("../middleware/authentication");

module.export = messagesRouter;
