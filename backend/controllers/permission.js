const connection = require("../models/db");

// make new function to create permission
const createNewPermission = (req, res) => {
  const { permission } = req.body;
  const role_id = req.params.id;
  const command = `INSERT INTO permissions (permission) VALUES (?)`;
  const data = [permission];
  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: `Server Error`, err: err });
    }
    if (result) {
      const permission_id = result.insertId;
      const command = `INSERT INTO roles_permissions (permission_id ,role_id ) VALUES (? , ?)`;

      const data = [permission_id, role_id];
      connection.query(command, data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: `Server Error`,
            err: err,
          });
        }
        res.status(201).json({
          success: true,
          message: "PermissionCreated",
          permission: result,
        });
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Permission Not Create`,
        err: err,
      });
    }
  });
};

module.exports = { createNewPermission };
