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
  createNewChatRoom,
  getAllUsersInRooms,
  blockUserFromRoom,
  unBlockUserFromRoom,
  sendFollowRequestToTheRoom,
  getAllFollowRequests,
  deleteUserFollowRequest,
  unFollowThisRoom,
} = require("../controllers/rooms");

const { createNewMessage } = require("../controllers/messages");

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

roomRouter.post("/:id/messages", authentication, createNewMessage);

///:userid/individual_room

roomRouter.post("/:userId/individual_room", authentication, createNewChatRoom);
roomRouter.get(`/:id/allusers`, authentication, getAllUsersInRooms);
roomRouter.delete("/:id/users/block", authentication, blockUserFromRoom);
roomRouter.put("/:id/users/unblock", authentication, unBlockUserFromRoom);
roomRouter.post("/:id/follow", authentication, sendFollowRequestToTheRoom);
roomRouter.get("/:id/follow_list", authentication, getAllFollowRequests);
roomRouter.delete(
  "/:id/remove_follow_request",
  authentication,
  deleteUserFollowRequest
);
roomRouter.put("/:id/unfollow" , authentication , unFollowThisRoom)

module.exports = roomRouter;
