import jwt from "jsonwebtoken";

const secret = "JWTSecret";
const generateToken = async (id: number) => {
  if (id > 0) {
    const token = jwt.sign({ _id: id }, secret);
    return token;
  }
};

const verifyToken = async (token: string) => {
  try {
    const data = jwt.verify(token, secret);
    return data;
  } catch (e) {
    console.error(e);
  }
};
export {generateToken, verifyToken};
