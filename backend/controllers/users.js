const connection = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
//test
const signup = async (req, res, next) => {
  const email = req.body.email.toLowerCase();

  const {
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

    if (err?.sqlMessage.includes(`'username' cannot be null`)) {
      return res
        .status(409)
        .json({ success: false, message: "The UserName Cannot Be Null" });
    }

    next();
  });
};

///////////signIn////////////////////////////////

const signIn = (req, res) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase();

  const command = `SELECT * FROM  roles INNER JOIN  users ON users.role_id=roles.id WHERE email=?`;

  const data = [email];
  connection.query(command, data, (err, result) => {
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) res.json(err);
        if (response) {
          const options = {
            expiresIn: process.env.TOKEN_EXP_Time,
          };

          const payload = {
            userId: result[0].id,
            role: result[0].role,
          };
          const secret = process.env.SECRET;

          const token = jwt.sign(payload, secret, options);

          res.status(200).json({
            success: true,
            massage: "Valid Login Credentials",

            token: token,
          });
        } else {
          return res.status(403).json({
            success: false,
            message: `The Password You Have Entered Is Incorrect`,
          });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "The email doesn't exist" });
    }
  });
};

/////////////signup with google////////////////////////

const signupWithGoogle = async (req, res, next) => {
  try {
    const { email, username, first_name, last_name, profile_image } = req.body;

    const command = `SELECT * FROM users where email=? `;

    const data = [email.toLowerCase()];

    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows, fields] = await asyncConnection.execute(command, data);

    if (rows.length) {
    return  next();
    }

    let password = (Math.random() + 1).toString(36).substring(1);

    const SALT = Number(process.env.SALT);
    const hashPassword = await bcrypt.hash(password, SALT);

    const command2 = `INSERT INTO users (email ,password,username , first_name , last_name  , profile_image , role_id) VALUES (? ,? , ?, ? ,?,?,3)`;

    const data2 = [
      email.toLowerCase(),
      hashPassword,
      username,
      first_name,
      last_name,
      profile_image,
    ];

    connection.query(command2, data2, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server Error",
          err: err.message,
        });
      }

      if (result) {
        next();
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      err: err.message,
    });
  }
};

/////////////////signIn with google /////////////////////

const signinWithGoogle = (req, res) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase();

  const command = `SELECT * FROM  roles INNER JOIN  users ON users.role_id=roles.id WHERE email=?`;

  const data = [email];
  connection.query(command, data, (err, result) => {
    if (result.length > 0) {
      if (err) {return res.json(err);}
      if (result) {
        const options = {
          expiresIn: process.env.TOKEN_EXP_Time,
        };

        const payload = {
          userId: result[0].id,
          role: result[0].role,
        };
        const secret = process.env.SECRET;

        const token = jwt.sign(payload, secret, options);

        res.status(200).json({
          success: true,
          massage: "Valid Login Credentials",

          token: token,
        });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "The email doesn't exist" });
    }
  });
};

///////////////////getAllUsernames/////////////////////////////

const getAllUsernames = (req, res) => {
  const userId = req.token.userId;
  const command = `SELECT * FROM users WHERE is_deleted=0 AND id != ${userId};`;

  connection.query(command, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "All The Usernames",
        users: result,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No User Have Signed To The Website",
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

//////////git My Info/////////////

const getUserInfo = (req, res) => {
  const id = req.token.userId;
  console.log(id);
  const command = `SELECT id,email,username ,first_name,last_name,country,profile_image,role_id FROM users WHERE is_deleted=0 AND id=? ;`;
  const data = [id];

  connection.query(command, data, (err, result) => {
    if (result.length > 0) {
      res.status(200).json({
        success: true,
        message: "The User Exists",
        user: result,
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

//============================================================================================================

// create function for super admin signup
const createNewAdmin = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const role_id = 1;
  const { password, username, first_name, last_name, country, profile_image } =
    req.body;

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

    if (err?.sqlMessage.includes(`'username' cannot be null`)) {
      return res
        .status(409)
        .json({ success: false, message: "The UserName Cannot Be Null" });
    }

    return res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      user: result,
    });
  });
};
//=================================================================================================================

const updateUserInfo = (req, res) => {
  const id = req.token.userId;

  const { email, first_name, last_name, country, profile_image } = req.body;

  const command = `SELECT * FROM users WHERE id = ?`;
  const data = [id];
  connection.query(command, data, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error", err: err });
    }

    const update_email = email || result[0].email;
    const update_first_name = first_name || result[0].first_name;
    const update_last_name = last_name || result[0].last_name;
    const update_country = country || result[0].country;
    const update_profile_image = profile_image || result[0].profile_image;

    const command_tow = `UPDATE users SET email =? , first_name= ? ,last_name=? , country = ? ,profile_image =? WHERE id = ? `;
    const data = [
      update_email,
      update_first_name,
      update_last_name,
      update_country,
      update_profile_image,
      id,
    ];

    connection.query(command_tow, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Server Error", err: err });
      }

      const commandThree =
        "UPDATE users_rooms SET user_profile_img= ? WHERE user_id = ? ";

      const data = [update_profile_image, id];

      connection.query(commandThree, data, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Server Error", err: err });
        }

        return res.status(201).json({
          message: "Account updated",
          user: {
            email: update_email,
            first_name: update_first_name,
            last_name: update_last_name,
            country: update_country,
            profile_image: update_profile_image,
          },
        });
      });
    });
  });
};

//////////////////////changePassword////////////////////////////////

const changePassword = async (req, res) => {
  try {
    const id = req.token.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const command = `SELECT * FROM users where id=? `;

    const data = [id];
    const asyncConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows, fields] = await asyncConnection.execute(command, data);

    bcrypt.compare(oldPassword, rows[0].password, async (err, result1) => {
      if (!result1) {
        return res.status(403).json({
          success: false,
          message: "The Old Password You Have Entered Is Incorrect",
        });
      }

      if (result1) {
        bcrypt.compare(newPassword, rows[0].password, async (err, result2) => {
          if (result2) {
            return res.status(400).json({
              success: false,
              message:
                "Your New Password Must Not Be the Same As Your Old Password ",
            });
          }

          if (!result2) {
            if (newPassword !== confirmPassword) {
              return res.status(400).json({
                success: false,
                message: "The New Password Does Not Match Confirm Password ",
              });
            } else {
              const command_tow = `UPDATE USERS SET password= ?  WHERE id = ?; `;
              const SALT = Number(process.env.SALT);
              const hashPassword = await bcrypt.hash(newPassword, SALT);

              const data2 = [hashPassword, id];

              const [rows, fields] = await asyncConnection.execute(
                command_tow,
                data2
              );
              return res.status(201).json({
                success: true,
                message: "Password Changed",
              });
            }
          }
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", err: err.message });
  }
};

module.exports = {
  signup,
  signIn,
  getAllUsernames,
  getUserInfo,
  createNewAdmin,
  updateUserInfo,
  changePassword,
  signupWithGoogle,
  signinWithGoogle,
};
