const connection = require("../models/db");

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
          room_id: room_Id,
          user_id: userId,
          is_deleted: 0,
        },
      });
    });
  });
};

module.exports = { createNewMessage };
