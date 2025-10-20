const users = require("../db/user.json");
var jwt = require("jsonwebtoken");

const login = (userphone, password) => {
  let user = users.find(
    (el) => el.userphone === userphone && el.password === password
  );

  if (!user) {
    return null;
  }

  var token = jwt.sign({ id: user.id, userphone: user.userphone }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  return token;
};

module.exports = {
  login,
};
