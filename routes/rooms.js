const express = require("express");

const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')
//room routes

const {
  getAllGroupRooms,
  getRoomById,
  deleteRoomById,
} = require("../controllers/rooms");

const roomRouter = express.Router();

roomRouter.get("/group", getAllGroupRooms);
roomRouter.get("/:id", getRoomById);
roomRouter.delete("/:id",authentication ,authorization(`DELETE_ROOMS`),  deleteRoomById);

module.exports = roomRouter;
