

const express  = require("express")

const authentication =require("../middleware/authentication")
const authorization =require("../middleware/authorization")



const { createNewRoomCategory ,getAllCategories ,updateCategoryById} = require("../controllers/category")

const categoryRouter = express.Router();

categoryRouter.post("/", authentication,authorization("CREATE_CATEGORIES"),createNewRoomCategory);
categoryRouter.put("/:id",authentication, authorization("Update_Categories"), updateCategoryById);
categoryRouter.get("/" , authentication,getAllCategories)

module.exports = categoryRouter;

