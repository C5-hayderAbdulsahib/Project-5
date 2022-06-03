const express = require("express");
//============================================
const { createNewPermission } = require("../controllers/permission");

const permissionRouter = express.Router();

permissionRouter.post("/:id", createNewPermission);

module.exports = permissionRouter;
