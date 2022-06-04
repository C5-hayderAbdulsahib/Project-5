const connection = require("../models/db");

const mysql = require("mysql2/promise");

//===============================================================================================================

// cerate function to create new room

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
        const command_five = ` UPDATE users SET role_id = 2 WHERE id = ? AND role_id != 1`;
        const data = [userId];
        connection.query(command_five, data, (err, result) => {
           if (err) {
             return res
               .status(500)
               .json({ success: false, message: "Server Error", err: err });
           }
        });

        res.status(201).json({ message: "Room Post Created", room: result[0] });
      });
    });
  });
};

//===============================================================================================================

const getAllGroupRooms = (req, res) => {
  const command = `SELECT * FROM rooms WHERE is_deleted=0 AND is_group=true;`;

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

//===============================================================================================================

const getRoomById = (req, res) => {
  const id = req.params.id;
  const command = `SELECT * FROM rooms WHERE is_deleted=0 AND id=? ;`;
  data = [id];

  //this query will select spicific room by it's id
  connection.query(command, data, (err, result) => {
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

///////updateRoomById/////////////

const updateRoomById = async (req, res) => {
  try {
    const { name, room_image } = req.body;
    const id = req.params.id;

    const findRoom = `SELECT * FROM rooms where id=? `;

    const roomData = [id];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows, fields] = await asyncConnection.execute(findRoom, roomData);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "The room is not found" });
    }

    const updatedNAme = name || rows[0].name;
    const updatedImg = room_image || rows[0].room_image;

    const command = `UPDATE rooms SET name=?, room_image=? WHERE id=? AND is_deleted=0;`;
    const data = [updatedNAme, updatedImg, id];

    //this query will select specific room by it's id  and update it's name and it's photo
    connection.query(command, data, (err, result) => {
      if (result.affectedRows) {
        res.status(200).json({
          success: true,
          message: `Room Updated `,
          room: { id: id, name: updatedNAme, room_image: updatedImg },
        });
      } else {
        res.status(404).json({
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
  }
};
//===============================================================================================================

// create function to delete room by id

const deleteRoomById = (req, res) => {
  const id = req.params.id;

  const command = `UPDATE rooms SET is_deleted = 1 where id = ?`;
  const data = [id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        err: err,
      });
    }
    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    res.status(200).json({ success: true, message: "Room Deleted" });
  });
};

//===============================================================================================================

//create function to get all user room
const getAllMyRooms = (req, res) => {
  const id = req.token.userId;

  const command = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE user_id = ?`;
  const data = [id];
  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }

    if (!result.length) {
      return res
        .status(200)
        .json({ success: false, message: "No Room Were Created Yet" });
    }
    res
      .status(200)
      .json({ success: true, message: "All The Room", rooms: result });
  });
};

module.exports = {
  createNewRoom,
  getAllGroupRooms,
  updateRoomById,
  getRoomById,
  deleteRoomById,
  getRoomById,
  getAllMyRooms,
};
