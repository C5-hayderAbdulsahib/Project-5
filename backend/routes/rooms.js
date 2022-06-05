const express = require("express");

const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
//room routes

const {
  getAllGroupRooms,
  getRoomById,
  updateRoomById,
  getAllMyRooms,
  deleteRoomById,
  createNewChatRoom
} = require("../controllers/rooms");

 const{createNewMessage}=require("../controllers/messages") 

const roomRouter = express.Router();

//////////// build roomRoutes////////

roomRouter.get("/group", authentication, getAllGroupRooms);
roomRouter.get("/my_rooms", authentication, getAllMyRooms);

roomRouter.get("/:id", authentication, getRoomById);
roomRouter.put(
  "/:id",
  authentication,
  authorization("UPDATE_ROOMS"),
  updateRoomById
);
roomRouter.delete(
  "/:id",
  authentication,
  authorization(`DELETE_ROOMS`),
  deleteRoomById
);

 roomRouter.post("/:id/messages" , authentication,createNewMessage) 

 ///:userid/individual_room

 roomRouter.post("/:userId/individual_room",authentication,createNewChatRoom)

module.exports = roomRouter;
