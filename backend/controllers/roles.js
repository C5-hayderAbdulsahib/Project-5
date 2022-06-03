const connection = require("../models/db");

const createNewRole = (req, res) => {
  const { role } = req.body;

  const command = `INSERT INTO roles (role) VALUES (?)`;
  const data = [role];
  connection.query(command, data, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "server error*",
        err: err,
      });
    }
    res.status(201).json({
      success: true,
      massage: "Role Created",
      results: results,
    });
  });
};

module.exports = {
  createNewRole,
};
