const connection = require("../models/db");

/////////create new Category

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

///////////////////git all Categories

const getAllCategories = (req, res) => {
  const command = `SELECT * FROM categories WHERE is_deleted=0;`;

  connection.query(command, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "All The Categories",
        categories: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Categories Yet",
      });
    }

    if (err) {
      res.status(500).json({
        success: false,
        message: "Server Error",
        err: err,
      });
    }
  });
};

 
module.exports = { createNewRoomCategory ,getAllCategories};
