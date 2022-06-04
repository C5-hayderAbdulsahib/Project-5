const connection = require("../models/db");

//this function build to check if the user has the authorization to make some function or not

const authorization = (string) => {
  return function (req, res, next) {
    const user_id = req.token.userId;
    const data = [user_id];
    const command = `SELECT * FROM users U WHERE U.id = (?)`;
    connection.query(command, data, (err, result) => {
      const command2 = `SELECT * FROM roles_permissions RP INNER JOIN permissions P ON RP.permission_id = P.id WHERE RP.role_id = (?) AND P.permission = (?)`;

      const data = [result[0].role_id, string];

      connection.query(command2, data, (err, result) => {
        if (result.length) {
          next();
        } else {
          res.status(400).json({ message: "unauthorized" });
        }
      });
    });
  };
};

module.exports = authorization;
