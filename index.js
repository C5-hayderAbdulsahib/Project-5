const express = require("express");

//since the require is inside the index.js it will affect all the files of the project
require("dotenv").config();

//we required the db file in order to make the connection with the database
require("./models/db");

const app = express();


//here we will import the routers

const roleRouter = require("./routes/roles");

//built-in middleware
app.use(express.json());

// router middleware

app.use("/roles", roleRouter);

 
const permissionRouter = require("./routes/permission")

app.use("/permissions" , permissionRouter);
 


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
