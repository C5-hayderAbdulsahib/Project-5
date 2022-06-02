const express = require("express");

//since the require is inside the index.js it will affect all the files of the project
require("dotenv").config();

//we required the db file in order to make the connection with the database
require("./models/db");

const app = express();

//here we will import the routers

const roleRouter = require("./routes/roles");
const permissionRouter = require("./routes/permission");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/category")
const roomRouter=require("./routes/rooms")
//built-in middleware
app.use(express.json());

// router middleware
//=================================================================================================================
app.use("/roles", roleRouter);
app.use("/permissions", permissionRouter);
app.use("/users", usersRouter);
app.use("/categories", categoryRouter);
app.use("/rooms",roomRouter)

//=================================================================================================================
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
