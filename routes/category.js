

const express  = require("express")


const { createNewRoomCategory ,getAllCategories ,updateCategoryById} = require("../controllers/category")

const categoryRouter = express.Router();

categoryRouter.post("/", createNewRoomCategory);
categoryRouter.put("/:id", updateCategoryById);
categoryRouter.get("/" , getAllCategories)

module.exports = categoryRouter;

