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
      const command_three = `INSERT INTO users_rooms (room_id , user_id, is_member) VALUES (?,?,1)`;
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
    const userIdFromBody = req.body.userId;
    const thisUserId = req.token.userId;

    const command = `SELECT * FROM USERS WHERE id =?`;
    const data = [userIdFromBody];

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

    const getMyData = `SELECT * FROM USERS WHERE id =?`;
    const myData = [thisUserId];

    const [myRawData, fields2] = await asyncConnection.execute(
      getMyData,
      myData
    );
    if (!myRawData[0]) {
      return res.status(404).json({
        success: false,
        message: "This User Is Not Found",
      });
    }

    const command_2 = `INSERT INTO rooms  (name) VALUES (?)`;
    const data_2 = [""];
    connection.query(command_2, data_2, async (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error", err: err });
      } else {
        const command_3 = `INSERT INTO users_rooms  (room_id ,user_id, is_member, user_username, user_profile_img ) VALUES ( ? , ?, 1, ?, ?)`;
        const data2 = [
          result.insertId,
          thisUserId,
          myRawData[0].username,
          myRawData[0].profile_image,
        ];

        const [rows2, fields2] = await asyncConnection.execute(
          command_3,
          data2
        );

        const command_4 = `INSERT INTO users_rooms  (room_id ,user_id, is_member, user_username, user_profile_img) VALUES (?, ?, 1, ?, ?)`;
        const data3 = [
          result.insertId,
          rows[0].id,
          rows[0].username,
          rows[0].profile_image,
        ];

        const [rows3, fields] = await asyncConnection.execute(command_4, data3);

        return res.status(201).json({
          success: true,
          message: "Private Room Was Created",
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

const getRoomById = async (req, res) => {
  const id = req.params.id;
  const userId = req.token.userId;
  const command = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE room_id= ? And user_id = ? And rooms.is_deleted = 0 AND users_rooms.is_blocked = 0 `;
  data = [id, userId];

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
      message: "The Room Is Not Found",
    });
  }

  if (rows[0].is_group === 1) {
    return res.status(200).json({
      success: true,
      message: `The Room For The Specified Id `,
      room: rows[0],
    });
  }

  const command2 = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE room_id= ? And user_id != ? And rooms.is_deleted = 0 `;
  data2 = [id, userId];

  const [rowsPrivateRoom, fields2] = await asyncConnection.execute(
    command2,
    data2
  );

  const privateRoomData = {
    ...rowsPrivateRoom[0],
    name: rowsPrivateRoom[0].user_username,
    room_image: rowsPrivateRoom[0].user_profile_img,
  };

  res.status(200).json({
    success: true,
    message: `The Room For The Specified Id `,
    room: privateRoomData,
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
const getAllMyRooms = async (req, res) => {
  const myUserId = req.token.userId;

  const command = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE user_id = ? AND is_blocked = 0 AND rooms.is_group = 1 AND rooms.is_deleted = 0 AND users_rooms.is_member = 1`;
  const data = [myUserId];

  const asyncConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rowsMyGroupRooms, fields] = await asyncConnection.execute(
    command,
    data
  );

  const command2 = `SELECT room_id FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE user_id = ? AND is_blocked = 0 AND rooms.is_group = 0 AND rooms.is_deleted = 0 AND users_rooms.is_member = 1`;
  const data2 = [myUserId];

  const [rowsAllMyPrivateRoom, fields2] = await asyncConnection.execute(
    command2,
    data2
  );

  const allMyPrivateRoomsIdsArr = rowsAllMyPrivateRoom.map((element) => {
    return element.room_id;
  });

  const command3 = `SELECT * FROM users_rooms INNER JOIN rooms ON users_rooms.room_id= rooms.id WHERE is_blocked = 0 AND rooms.is_group = 0 AND rooms.is_deleted = 0`;
  const data3 = [myUserId];

  const [rowsAllPrivateRooms, fields3] = await asyncConnection.execute(
    command3,
    data3
  );

  const allPrivateRoomsAmIn = rowsAllPrivateRooms.filter((element) => {
    return allMyPrivateRoomsIdsArr.includes(element.room_id);
  });

  const allMyPrivateRoom = allPrivateRoomsAmIn.filter((element) => {
    return element.user_id !== myUserId;
  });

  const allMyPrivateRoomData = allMyPrivateRoom.map((element) => {
    element.name = element.user_username;
    element.room_image = element.user_profile_img;
    return element;
  });

  const allMyPrivateAndGroupRooms =
    rowsMyGroupRooms.concat(allMyPrivateRoomData);

  if (allMyPrivateAndGroupRooms.length === 0) {
    return res.status(200).json({
      success: false,
      message: "You Need To Join A Room Or Create A New Room",
    });
  }

  res.status(200).json({
    success: true,
    message: "All My Rooms",
    rooms: allMyPrivateAndGroupRooms,
  });
};

//=========================================================================================================

const getAllUsersInRooms = (req, res) => {
  const room_id = req.params.id;

  const adminId = req.token.userId;

  console.log(room_id);

  const command = `SELECT * FROM users_rooms INNER JOIN users ON users_rooms.user_id = users.id WHERE users_rooms.room_id = ? And is_member = 1 AND user_id != ${adminId} `;

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
        .json({ success: false, message: `There Is No Users In This Room` });
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

// create function that make admin get all follow request

const getAllFollowRequests = (req, res) => {
  const room_id = req.params.id;

  const command = `SELECT * FROM users_rooms INNER JOIN users ON users_rooms.user_id = users.id WHERE users_rooms.room_id = ? AND users_rooms.send_follow_request = 1 AND users_rooms.is_deleted = 0 AND users_rooms.is_member = 0`;

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
  const userId = req.body.userId;

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
    res.status(201).json({
      success: true,
      message: "Follow Request Has Been Removed",
      follow_request: result,
    });
  });
};

///////////////

const addUserToTheRoom = (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  console.log(id);
  const command = `UPDATE users_rooms SET send_follow_request = 0 , is_member =1 WHERE  room_id = ? AND user_id=? `;
  const data = [id, userId];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    console.log(result);
    if (!result.affectedRows) {
      return res
        .status(400)
        .json({ success: false, message: "The Room Is Not Found" });
    }
    res.status(201).json({
      success: true,
      message: "User Was Added To the Group Successfully",
      user: result,
    });
  });
};

///////////////getAllRoomsForCategory//////////////////

const getAllRoomsForCategory = (req, res) => {
  const id = req.params.id;

  const command = `SELECT * FROM rooms  WHERE category_id =? AND is_deleted = 0`;

  const data = [id];

  connection.query(command, data, (err, result) => {
    console.log(result);
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "All The Room That Belong To This Category",
        rooms: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Room Were Created Yet For This Category",
      });
    }

    if (err) {
      return res.status(500).json({
        success: false,
        message: "false",
        err: err.message,
      });
    }
  });
};

/////////////getAllMyCreatedRoom/////////////////////

const getAllMyCreatedRoom = (req, res) => {
  const id = req.token.userId;

  const command = `SELECT * FROM rooms  WHERE  admin_id =? AND is_group=1 `;

  const data = [id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
    if (!result.length) {
      return res.status(200).json({
        success: false,
        message: "You Did Not Create Any Room Yet",
      });
    }
    res.status(200).json({
      success: true,
      message: "All The Room That I Have Created",
      rooms: result,
    });
  });
};

/////////////getAllUsersRoomsRelations//////////////////////

const getAllUsersRoomsRelations = (req, res) => {
  const command = `SELECT * FROM users_rooms `;

  connection.query(command, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
    if (!result.length) {
      return res.status(200).json({
        success: false,
        message: "No Relation Were Yet Created",
      });
    }
    res.status(200).json({
      success: true,
      message: "All The Relation of The Rooms With the Users",
      users_rooms_relation: result,
    });
  });
};

///////leaveRoom/////////////////////////

const leaveRoom = (req, res) => {
  const userId = req.token.userId;
  console.log(userId);

  const id = req.params.id;

  const command = ` UPDATE users_rooms SET is_member = 0 WHERE room_id = ? AND user_id=?`;
  const data = [id, userId];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err.message });
    }
    if (!result.affectedRows) {
      console.log(result);
      return res.status(404).json({
        success: false,
        message: "The Room Is Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "You Have Left This Room",
      rooms: result,
    });
  });
};

/////////////////////////////////

const deleteRoomByIdForAdmin = (req, res) => {
  const id = req.params.id;
  const userId = req.token.userId;

  const command = `UPDATE rooms SET is_deleted = 1 where id = ?`;
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
  addUserToTheRoom,
  getAllRoomsForCategory,
  getAllMyCreatedRoom,
  getAllUsersRoomsRelations,
  leaveRoom,
  deleteRoomByIdForAdmin,
};
