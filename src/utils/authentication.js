const jwt = require("jsonwebtoken");

const secret = "JWTSecret";
const generateToken = async (id) => {
  if (id > 0) {
    const token = jwt.sign({ _id: id }, secret);
    return token;
  }
};

const verifyToken = async (token) => {
  try {
    const data = jwt.verify(token, secret);
    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { generateToken, verifyToken };
