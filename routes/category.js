const express = require("express");
const {
  createNewRoomCategory,
  updateCategoryById,
} = require("../controllers/category");

const categoryRouter = express.Router();

categoryRouter.post("/", createNewRoomCategory);
categoryRouter.put("/:id", updateCategoryById);

module.exports = categoryRouter;
