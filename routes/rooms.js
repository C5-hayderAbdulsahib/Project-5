const express = require("express");

 

//room routes 

const {getAllGroupRooms,getRoomById,updateRoomById}=require("../controllers/rooms")

const roomRouter =express.Router();


roomRouter.get("/group",getAllGroupRooms)
roomRouter.get("/:id",getRoomById)
roomRouter.put("/:id",updateRoomById)



module.exports=roomRouter


