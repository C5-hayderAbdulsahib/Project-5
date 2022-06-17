const connection = require("../models/db");
const mysql = require("mysql2/promise");

const createNewMessage = (req, res) => {
  const room_Id = req.params.id;

  const { description, message_image, document } = req.body;
  const userId = req.token.userId;

  const command = `SELECT * FROM rooms WHERE id =?`;
  const data = [room_Id];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }
    if (!result.length) {
      return res
        .status(404)
        .json({ success: false, message: "The Room Is Not Found" });
    }

    const command_two = `Insert INTO messages (description,message_image,document,room_id,user_id) VALUES(?,?,?,?,?)`;
    const data = [description, message_image, document, room_Id, userId];

    connection.query(command_two, data, (err, result) => {
      return res.status(201).json({
        success: true,
        message: "Message Has Been Created",
        new_message: {
          id: result.insertId,
          description,
          message_image,
          document,
          room_id: +room_Id,
          user_id: +userId,
          is_deleted: 0,
        },
      });
    });
  });
};

//////////getAllMessages///////////////////////////////////////

const getAllMessages = (req, res) => {
  const roomId = req.params.id;

  const command = `SELECT * FROM messages WHERE is_deleted=0 AND room_id = ? ORDER BY created_at DESC `;
  const data = [roomId];

  connection.query(command, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        err: err,
      });
    }

    if (result?.length > 0) {
      res.status(200).json({
        success: true,
        message: "All The Messages",
        All_Messages: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No Message Has Been Send Yet",
      });
    }
  });
};

//////////////updateMessageById/////////////////

const updateMessageById = async (req, res) => {
  try {
    const { description, message_image, document } = req.body;
    const id = req.params.id;

    const findMessage = `SELECT * FROM messages where id=? `;

    const messageData = [id];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows, fields] = await asyncConnection.execute(
      findMessage,
      messageData
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "The message is not found" });
    }

    const updatedDescription = description || rows[0].description;
    const updatedMessage_image = message_image || rows[0].message_image;
    const updatedDocument = document || rows[0].document;

    const command = `UPDATE messages SET description=?, message_image=? ,document=? WHERE id=? AND is_deleted=0;`;
    const data = [
      updatedDescription,
      updatedMessage_image,
      updatedDocument,
      id,
    ];

    //this query will select specific message by it's id  and update it's description and it's photo and it's document

    connection.query(command, data, (err, result) => {
      if (result.affectedRows) {
        res.status(200).json({
          success: true,
          message: `Message Updated `,
          room: {
            id: id,
            description: updatedDescription,
            message_image: updatedMessage_image,
            document: updatedDocument,
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: "The Message Is Not Found",
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

//////////////////deleteMessageById////////////////////

const deleteMessageById = (req, res) => {
  const id = req.params.id;

  const command = `UPDATE messages SET is_deleted = 1 where id = ?`;
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
        .json({ success: false, message: "The Message Is Not Found" });
    }
    res.status(200).json({ success: true, message: "Message Deleted" });
  });
};

module.exports = {
  createNewMessage,
  getAllMessages,
  updateMessageById,
  deleteMessageById,
};
