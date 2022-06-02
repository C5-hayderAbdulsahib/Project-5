const connection = require("../models/db");

const createNewRoom = (req, res) => {
  const { name, room_image } = req.body;
  const category_id = req.params.id;
  const userId = req.token.userId;

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
      const command_three = `INSERT INTO users_rooms (room_id , user_id) VALUES (?,?)`;
      const data_1 = [room_id, userId];
      connection.query(command_three, data_1, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Server Error", err: err });
        }
      });
      const command_four = `SELECT * FROM rooms WHERE id = ? `;
      const data = [room_id];

      connection.query(command_four, data, (err, result) => {
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

////////////git all rooms////////////////////////

const getAllGroupRooms = (req, res) => {
  const command = `SELECT * FROM rooms WHERE is_deleted=0 AND is_group=true ;`;

  connection.query(command, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "All The Room",
        categories: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Room Were Created Yet",
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

//////////////getRoomById////////////////////////

const getRoomById = (req, res) => {
  const id = req.params.id;
console.log(id);
  const command = `SELECT * FROM rooms WHERE is_deleted=0 AND id=? ;`;
  data = [id];
  connection.query(command,data, (err, result) => {
    console.log(result);
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: `The Room For The Specified Id `,
        room: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "The Room Is Not Found",
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

module.exports = { createNewRoom, getAllGroupRooms, getRoomById };

/*
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
      });*/
