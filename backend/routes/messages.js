const express = require("express");

const messagesRouter = express.Router();

const authentication = require("../middleware/authentication");

const {
  getAllMessages,
  updateMessageById,
  deleteMessageById,
} = require("../controllers/messages");

messagesRouter.get("/:id", authentication, getAllMessages);
messagesRouter.put("/:id", authentication, updateMessageById);

messagesRouter.delete("/:id", authentication, deleteMessageById);

module.exports = messagesRouter;
