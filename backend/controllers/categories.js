const { query } = require("../models/db");
const connection = require("../models/db");

//===============================================================================================================

// this function to create new Category
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

      res.status(201).json({
        success: true,
        message: "Category Created",
        category: result[0],
      });
    });
  });
};

//===============================================================================================================

// this function to get all Categories
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

//===============================================================================================================

// this function to update Category
const updateCategoryById = (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  const command = `SELECT * FROM categories WHERE id = ? `;
  const data = [id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    const updatedName = name || result[0].name;
    const command_tow = ` UPDATE categories SET name = ? WHERE id = ?`;
    const data = [updatedName, id];
    connection.query(command_tow, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error", err: err });
      }
      if (!result.affectedRows) {
        return res
          .status(404)
          .json({ success: false, message: "The Category Is Not Found" });
      }
      res.status(201).json({
        success: true,
        message: "Category Updated",
        category: { id: id, name: updatedName },
      });
    });
  });
};

//===============================================================================================================

// create function  to delete Category
const deleteCategoryById = (req, res) => {
  const id = req.params.id;
  const command = `UPDATE categories SET is_deleted = 1 where id = ? `;
  const data = [id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "The Category Is Not Found" });
    }
    res.status(200).json({ success: true, message: "Category Deleted" });
  });
};

/////////////////////////////

const getCategoryById = (req, res) => {
  const id = req.params.id;

  const command = `SELECT * FROM categories WHERE id = ? AND is_deleted = 0 ;`;

  const data = [id];

  connection.query(command, data, (err, result) => {
    console.log(result);
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "The Category Is Not Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "The Category For The Specified Id",
        category: result[0],
      });
    }
  });
};

module.exports = {
  createNewRoomCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
};
