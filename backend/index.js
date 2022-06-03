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
const permissionRouter = require("./routes/permission");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/category");
const roomRouter = require("./routes/rooms");
//built-in middleware
app.use(express.json());

// router middleware
//=================================================================================================================
app.use("/roles", roleRouter);
app.use("/permissions", permissionRouter);
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/rooms", roomRouter);

//=================================================================================================================
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
