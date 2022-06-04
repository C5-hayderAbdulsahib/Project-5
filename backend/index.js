const express = require("express");
//adding the cores package
const cors = require("cors");

//since the require is inside the index.js it will affect all the files of the project
require("dotenv").config();

//we required the db file in order to make the connection with the database
require("./models/db");

const app = express();
app.use(cors()); //we created an application-level middleware and invoke it the cors function, and the reason for that if we want these api that we created to be used by the frontend code then we have to give it the cors permissions

//here we will import the routers

const roleRouter = require("./routes/roles");
const permissionRouter = require("./routes/permissions");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/categories");
const roomRouter = require("./routes/rooms");
const messagesRouter=require("./routes/messages");
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

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
