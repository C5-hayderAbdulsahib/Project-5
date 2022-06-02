const express  = require("express")
const { createNewRoomCategory } = require("../controllers/category")


const categoryRouter = express.Router();


 categoryRouter.post("/" , createNewRoomCategory)

 module.exports = categoryRouter;