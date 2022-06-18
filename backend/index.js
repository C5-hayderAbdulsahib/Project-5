const express = require("express");
//adding the cores package to make the api accessible
const cors = require("cors");

//since the require is inside the index.js it will affect all the files of the project
require("dotenv").config();

//we required the db file in order to make the connection with the database
require("./models/db");

const app = express();
app.use(cors()); //we created an application-level middleware and invoke it the cors function, and the reason for that if we want these api that we created to be used by the frontend code then we have to give it the cors permissions

const socket = require("socket.io");

//require data from the models from the DB
const connection = require("./models/db");
const mysql = require("mysql2/promise");

//here we will import the routers
const roleRouter = require("./routes/roles");
const permissionRouter = require("./routes/permissions");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/categories");
const roomRouter = require("./routes/rooms");
const messagesRouter = require("./routes/messages");
//built-in middleware
app.use(express.json());

// router middleware
//=================================================================================================================
app.use("/roles", roleRouter);
app.use("/permissions", permissionRouter);
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/rooms", roomRouter);
app.use("/messages", messagesRouter);

//=================================================================================================================

//////////////////////////////////////////////////////////////////////////////////
// Handles any other endpoints [unassigned - endpoints]

// this is an Error-handling middleware and it has to be at the bottom of the page before the app.listen
//it job is to print an error if the user enter a wrong endpoint(url)

// the reason that this code work is because it is at the end of the file so first it will go and check the routes above and if it found a matching route then it will go inside it and if there is a response then it will stop the execution of the file and it will never reach this middleware,
//but if it did not found any matching routes then it will reach this middleware and execute it

app.use("*", (req, res, next) => {
  //it is true that we don't need to specify an (endpoint or next parameter) in this task, but it is better to give it an endpoint and if it is going to affect all the routes then we give it "*" as an endpoint, so that why each middleware should have an endpoint and the next parameter so that it does not get confused with a request handling function(or a controller) because there is no request handling function(or a controller) that have an endpoint of "*"

  const error = new Error("NO content at this path");
  error.status = 404;
  res.status(404).json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("JOIN_ROOM", (roomId) => {
    console.log(roomId);
    // .join() is used to separate the session into private rooms depending on the data
    socket.join(roomId);
  });

  socket.on("GET_MESSAGES", async (roomId) => {
    const command = `SELECT * FROM users INNER JOIN messages on users.id = messages.user_id WHERE messages.is_deleted=0 AND room_id = ? ORDER BY created_at DESC`;
    const data = [roomId];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows, fields] = await asyncConnection.execute(command, data);

    io.in(roomId).emit("SEND_MESSAGE_TO_FRONT", rows);
  });

  //function for creating text messages
  socket.on("SEND_MESSAGE_TO_BACKEND", async (messageContent) => {
    const command = `Insert INTO messages (description,room_id,user_id) VALUES(?,?,?)`;
    const data = [
      messageContent.content.description,
      messageContent.room_id,
      messageContent.content.user_id,
    ];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows, fields] = await asyncConnection.execute(command, data);

    const command2 = `SELECT * FROM users INNER JOIN messages on users.id = messages.user_id WHERE messages.is_deleted=0 AND room_id = ? ORDER BY created_at DESC`;
    const data2 = [messageContent.room_id];

    const [rows2, fields2] = await asyncConnection.execute(command2, data2);

    io.in(messageContent.room_id).emit("SEND_MESSAGE_TO_FRONT", rows2);
  });

  //function for creating images messages
  socket.on("SEND_IMAGE_TO_BACKEND", async (messageContent) => {
    const command = `Insert INTO messages (message_image,room_id,user_id) VALUES(?,?,?)`;
    const data = [
      messageContent.content.message_image,
      messageContent.room_id,
      messageContent.content.user_id,
    ];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows, fields] = await asyncConnection.execute(command, data);

    const command2 = `SELECT * FROM users INNER JOIN messages on users.id = messages.user_id WHERE messages.is_deleted=0 AND room_id = ? ORDER BY created_at DESC`;
    const data2 = [messageContent.room_id];

    const [rows2, fields2] = await asyncConnection.execute(command2, data2);

    io.in(messageContent.room_id).emit("SEND_MESSAGE_TO_FRONT", rows2);
  });

  //function for creating file messages
  socket.on("SEND_File_TO_BACKEND", async (messageContent) => {
    const command = `Insert INTO messages (document,document_name,room_id,user_id) VALUES(?,?,?,?)`;
    const data = [
      messageContent.content.document,
      messageContent.content.document_name,
      messageContent.room_id,
      messageContent.content.user_id,
    ];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows, fields] = await asyncConnection.execute(command, data);

    const command2 = `SELECT * FROM users INNER JOIN messages on users.id = messages.user_id WHERE messages.is_deleted=0 AND room_id = ? ORDER BY created_at DESC`;
    const data2 = [messageContent.room_id];

    const [rows2, fields2] = await asyncConnection.execute(command2, data2);

    io.in(messageContent.room_id).emit("SEND_MESSAGE_TO_FRONT", rows2);
  });

  //function for deleting messages
  socket.on("DELETE_MESSAGE", async (messageId, roomId) => {
    const command = `UPDATE messages SET is_deleted = 1 where id = ?`;
    const data = [messageId];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows, fields] = await asyncConnection.execute(command, data);

    const command2 = `SELECT * FROM users INNER JOIN messages on users.id = messages.user_id WHERE messages.is_deleted=0 AND room_id = ? ORDER BY created_at DESC`;
    const data2 = [roomId];

    const [rows2, fields2] = await asyncConnection.execute(command2, data2);

    io.in(roomId).emit("SEND_MESSAGE_TO_FRONT", rows2);
  });

  //function for updating messages
  socket.on("UPDATE_MESSAGE", async (messageId, roomId, messageDescription) => {
    const command = `UPDATE messages SET description=? WHERE id=? AND is_deleted=0;`;
    const data = [messageDescription, messageId];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    const [rows, fields] = await asyncConnection.execute(command, data);

    const command2 = `SELECT * FROM users INNER JOIN messages on users.id = messages.user_id WHERE messages.is_deleted=0 AND room_id = ? ORDER BY created_at DESC`;
    const data2 = [roomId];

    const [rows2, fields2] = await asyncConnection.execute(command2, data2);

    io.in(roomId).emit("SEND_MESSAGE_TO_FRONT", rows2);
  });

  socket.on("disconnect", () => {
    console.log(`user left...`);
  });
});
