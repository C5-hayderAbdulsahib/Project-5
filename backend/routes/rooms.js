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
  addUserToTheRoom,

  getAllMyCreatedRoom,
  getAllUsersRoomsRelations,
  leaveRoom,
  deleteRoomByIdForAdmin,
} = require("../controllers/rooms");

const { createNewMessage } = require("../controllers/messages");

const roomRouter = express.Router();

//////////// build roomRoutes////////

//we have to put these routs above the dynamic routs :id Or  the dynamic routs will be executed first
roomRouter.get("/group", authentication, getAllGroupRooms);
roomRouter.get("/my_rooms", authentication, getAllMyRooms);
roomRouter.get("/my_created_rooms", authentication, getAllMyCreatedRoom);
roomRouter.post("/individual_room", authentication, createNewChatRoom);

roomRouter.get(
  "/user_room_relation",
  authentication,
  getAllUsersRoomsRelations
);

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

roomRouter.put("/:id/unfollow", authentication, unFollowThisRoom);

roomRouter.put("/:id/add_user", authentication, addUserToTheRoom);

roomRouter.put("/:id/leave_room", authentication, leaveRoom); //
roomRouter.delete(
  "/:id/admin",
  authentication,
  authorization(`DELETE_ROOMS_ADMIN`),
  deleteRoomByIdForAdmin
);

module.exports = roomRouter;
