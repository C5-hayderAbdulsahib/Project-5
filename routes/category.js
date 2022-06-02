const express  = require("express")
const { createNewRoomCategory ,getAllCategories } = require("../controllers/category")


const categoryRouter = express.Router();


 categoryRouter.post("/" , createNewRoomCategory)

 categoryRouter.get("/" , getAllCategories)

 module.exports = categoryRouter;