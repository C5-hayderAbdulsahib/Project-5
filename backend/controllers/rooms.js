const connection = require("../models/db");

const mysql = require("mysql2/promise");
const res = require("express/lib/response");

//===============================================================================================================

// cerate function to create new room

const createNewGroupRoom = (req, res) => {
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
    const command_tow = `INSERT INTO rooms (name ,room_image , category_id, admin_id,is_group) VALUES (?,?,?,?,1)`;
    const data = [name, room_image, category_id, userId];

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
        rooms: result,
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

////////////////////createNewChatRoom///////////////////////////

const createNewChatRoom = async (req, res) => {
  try {
    const userIdFromParams = req.params.userId;
    const thisUserId = req.token.userId;

    const command = `SELECT * FROM USERS WHERE id =?`;
    const data = [userIdFromParams];

    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows, fields] = await asyncConnection.execute(command, data);
    if (!rows[0]) {
      return res.status(404).json({
        success: false,
        message: "This User Is Not Found",
      });
    }

    const command_2 = `INSERT INTO rooms  (name ,room_image ) VALUES ( ? , ?)`;
    const data_2 = [rows[0].username, rows[0].profile_image];
    connection.query(command_2, data_2, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error", err: err });
      } else {
        const command_3 = `INSERT INTO users_rooms  (room_id ,user_id ) VALUES ( ? , ?)`;
        const data2 = [result.insertId, rows[0].id];

        const asyncConnection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        });

        const [rows2, fields2] = await asyncConnection.execute(
          command_3,
          data2
        );

        const command_4 = `INSERT INTO users_rooms  (room_id ,user_id ) VALUES ( ? , ?)`;
        const data3 = [result.insertId, thisUserId];

        const asyncConnection2 = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        });

        const [rows3, fields] = await asyncConnection2.execute(
          command_4,
          data3
        );

        return res.status(201).json({
          success: true,
          message: "Room Post Created",
          room: {
            id: result.insertId,
            name: rows[0].username,
            room_image: rows[0].profile_image,
            is_group: 0,
            is_deleted: 0,
          },
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

//===============================================================================================================

const getRoomById = (req, res) => {
  const id = req.params.id;
  const userId = req.token.userId;
  const command = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE room_id= ?And user_id = ? And rooms.is_deleted = 0 `;
  data = [id, userId];

  //this query will select spicific room by it's id
  connection.query(command, data, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: `The Room For The Specified Id `,
        room: result,
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
};

///////updateRoomById/////////////

const updateRoomById = async (req, res) => {
  try {
    const { name, room_image } = req.body;
    const id = req.params.id;
    const userId = req.token.userId;

    const findRoom = `SELECT * FROM rooms where id=? AND admin_id=? `;

    const roomData = [id, userId];
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
  const userId = req.token.userId;

  const command = `UPDATE rooms SET is_deleted = 1 where id = ? AND admin_id=?`;
  const data = [id, userId];

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

  const command = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE user_id = ? AND is_blocked = 0 AND rooms.is_deleted = 0`;
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

//=========================================================================================================

const getAllUsersInRooms = (req, res) => {
  const userId = req.token.userId;
  const room_id = req.params.id;

  console.log(room_id);

  const command = `SELECT * FROM users_rooms INNER JOIN users ON users_rooms.user_id = users.id WHERE users_rooms.room_id = ? And is_member = 1 `;

  const data = [room_id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: `This User Has ` });
    }

    res.status(200).json({
      success: true,
      message: "All The Users In This Room",
      roomUsers: result,
    });
  });
};

//=========================================================================================================

// create function to make admin block user in his room

const blockUserFromRoom = (req, res) => {
  const room_id = req.params.id;
  const userId = req.body.userId;

  const command = `UPDATE users_rooms SET is_blocked =1 WHERE room_id = ? AND user_id = ? `;

  const data = [room_id, userId];
  connection.query(command, data, (err, result) => {
    console.log(result);

    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.affectedRows) {
      res
        .status(404)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "The User Was Block From This Chat" });
  });
};

//=========================================================================================================

// create function to make admin of room  unblock user

const unBlockUserFromRoom = (req, res) => {
  const room_id = req.params.id;
  const userId = req.body.userId;

  const command = `UPDATE users_rooms SET is_blocked = 0 WHERE room_id = ? AND user_id = ? `;

  const data = [room_id, userId];
  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    res.status(201).json({
      success: true,
      message:
        "You Have Unblocked This User And He Will Have Access To this Room",
    });
  });
};

//=========================================================================================================

// create function to send follow for specific room

const sendFollowRequestToTheRoom = (req, res) => {
  const room_id = req.params.id;
  const userId = req.token.userId;

  const command = `INSERT INTO users_rooms (room_id , user_id ,send_follow_request ) VALUES (? , ? , 1)`;

  const data = [room_id, userId];

  connection.query(command, data, (err, result) => {
    if (result == undefined) {
      return res
        .status(404)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    res.status(201).json({
      success: true,
      message: "Follow Request Has Been Send",
      follow_request: result,
    });
  });
};

//=========================================================================================================

// cerate function that make admin get all follow request

const getAllFollowRequests = (req, res) => {
  const room_id = req.params.id;

  const command = `SELECT * from users_rooms WHERE room_id = ? AND send_follow_request = 1 AND is_deleted = 0 AND is_member = 0  `;

  const data = [room_id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.length) {
      return res.status(200).json({
        success: false,
        message: "No Follow Request Has Been Send Yet",
      });
    }
    res.status(200).json({
      success: true,
      message: "All The Follow Requests",
      follow_requests: result,
    });
  });
};

//=========================================================================================================

// create function to make admin of room delete follow request for specific user

const deleteUserFollowRequest = (req, res) => {
  const room_id = req.params.id;
  const userId = req.token.userId;

  const command = `UPDATE users_rooms SET is_deleted = 1 WHERE user_id = ? AND room_id = ? `;

  const data = [userId, room_id];

  connection.query(command, data, (err, result) => {
    console.log(result);
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "The Follow Request Was Deleted" });
  });
};

//=========================================================================================================

const unFollowThisRoom = (req, res) => {
  const room_id = req.params.id;
  const userId = req.token.userId;

  const command = `UPDATE users_rooms SET send_follow_request = 0 WHERE user_id = ? AND room_id = ? `;

  const data = [userId, room_id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.affectedRows) {
      return res
        .status(400)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    res
      .status(201)
      .json({
        success: true,
        message: "Follow Request Has Been Removed",
        follow_request: result,
      });
  });
};

module.exports = {
  createNewChatRoom,
  createNewGroupRoom,
  getAllGroupRooms,
  updateRoomById,
  getRoomById,
  deleteRoomById,
  getRoomById,
  getAllMyRooms,
  getAllUsersInRooms,
  blockUserFromRoom,
  unBlockUserFromRoom,
  sendFollowRequestToTheRoom,
  getAllFollowRequests,
  deleteUserFollowRequest,
  unFollowThisRoom,
};
