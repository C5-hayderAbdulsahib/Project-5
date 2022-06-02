const express = require("express");

const {
  createNewRoomCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/category");

const categoryRouter = express.Router();

categoryRouter.post("/", createNewRoomCategory);
categoryRouter.put("/:id", updateCategoryById);
categoryRouter.get("/", getAllCategories);
categoryRouter.delete("/:id", deleteCategoryById);

module.exports = categoryRouter;
