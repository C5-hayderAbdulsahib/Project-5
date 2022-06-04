const express = require("express");

const messagesRouter = express.Router();

const authentication = require("../middleware/authentication");



const{getAllMessages}=require("../controllers/messages")

messagesRouter.get("/", authentication, getAllMessages);

module.exports = messagesRouter;


