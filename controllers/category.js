const connection = require("../models/db");

const createNewRoomCategory = (req, res) => {
  const { name } = req.body;

  const command = `INSERT INTO categories (name) VALUES (?) `;
  const data = [name];
  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }

    const command_tow = `SELECT * FROM categories WHERE id = ? `;
    const data = [result.insertId];
    connection.query(command_tow, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error", err: err });
      }

      res
        .status(201)
        .json({ success: true, message: "Category Created", category: result });
    });
  });
};

module.exports = { createNewRoomCategory };
