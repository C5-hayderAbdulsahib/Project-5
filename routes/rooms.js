const express = require("express");

 

//room routes 

const {getAllGroupRooms,getRoomById}=require("../controllers/rooms")

const roomRouter =express.Router();


roomRouter.get("/group",getAllGroupRooms)
roomRouter.get("/:id",getRoomById)

module.exports=roomRouter


