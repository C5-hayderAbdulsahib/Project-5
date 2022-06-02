const express  = require("express")

const authentication =require("../middleware/authentication")
const authorization =require("../middleware/authorization")



const { createNewRoomCategory ,getAllCategories ,updateCategoryById,deleteCategoryById,} = require("../controllers/category")

const {createNewRoom} = require("../controllers/rooms")

const categoryRouter = express.Router();

//categories routes
categoryRouter.post("/", authentication,authorization("CREATE_CATEGORIES"),createNewRoomCategory);
categoryRouter.put("/:id",authentication, authorization("UPDATE_CATEGORIES"), updateCategoryById);
categoryRouter.get("/" , authentication,getAllCategories);
categoryRouter.delete("/:id",authentication, authorization("DELETE_CATEGORIES"), deleteCategoryById);
categoryRouter.post("/:id/rooms", createNewRoom);


module.exports = categoryRouter;
