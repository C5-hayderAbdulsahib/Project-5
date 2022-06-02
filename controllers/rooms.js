const connection = require("../models/db");

const createNewRoom = (req, res) => {
  const { name, room_image } = req.body;
  const category_id = req.params.id;

  const command = `SELECT * FROM categories WHERE id = ?`;

  const data = [category_id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.length) {
      return res
        .status(404)
        .json({ success: false, message: "The Category Is Not Found" });
    }
    const command_tow = `INSERT INTO rooms (name ,room_image , category_id ) VALUES (?,?,?)`;
    const data = [name, room_image, category_id];

    connection.query(command_tow, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error", err: err });
      }
      const room_id = result.insertId;
      const command_three = `SELECT * FROM rooms WHERE id = ? `;
      const data = [room_id];
      connection.query(command_three, data, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Server Error", err: err });
        }
        res.status(201).json({ message: "Room Post Created", room: result[0] });
      });
    });
  });
};

module.exports = { createNewRoom };
