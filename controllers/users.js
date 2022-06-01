const connection = require("../models/db");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const {
    email,
    password,
    username,
    first_name,
    last_name,
    country,
    profile_image,
    role_id,
  } = req.body;

  const SALT = Number(process.env.SALT);
  const hashPassword = await bcrypt.hash(password, SALT);

  const command = `INSERT INTO users (email ,password ,username , first_name , last_name , country , profile_image , role_id) VALUES (? , ?,? , ?, ? , ?, ? , ?)`;
  const data = [
    email,
    hashPassword,
    username,
    first_name,
    last_name,
    country,
    profile_image,
    role_id,
  ];
  connection.query(command, data, (err, result) => {
    if (err?.sqlMessage.includes(`for key 'users.email`)) {
      return res
        .status(409)
        .json({ success: false, message: "The Email Already Exists" });
    }

    if (err?.sqlMessage.includes(`for key 'users.username`)) {
      return res
        .status(409)
        .json({ success: false, message: "The UserName Already Exists" });
    }
    //const findingUserName = `SELECT FROM users WHERE user`

   return res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      user: result,
    });
  });
};

module.exports = { signup };
