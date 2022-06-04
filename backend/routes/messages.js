const express = require("express");

const messagesRouter = express.Router();

const authentication = require("../middleware/authentication");



const{getAllMessages,updateMessageById}=require("../controllers/messages")

messagesRouter.get("/", authentication, getAllMessages);
messagesRouter.get("/", authentication, getAllMessages);
messagesRouter.put("/:id", authentication, updateMessageById);
module.exports = messagesRouter;


