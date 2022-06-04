const express = require("express");
//============================================
const { createNewPermission } = require("../controllers/permissions");

const permissionRouter = express.Router();

permissionRouter.post("/:id", createNewPermission);

module.exports = permissionRouter;
