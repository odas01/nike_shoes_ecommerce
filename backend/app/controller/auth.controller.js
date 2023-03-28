import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import responseHandler from "../handler/response.handler.js";

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: "180s",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

// register
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // check account exists
    if (user)
      return responseHandler.badrequest(res, "Email is already in use.");

    // encode password
    const newPassword = bcrypt.hashSync(password, 10);
    // resgis success
    const newUser = await User.create({ ...req.body, password: newPassword });
    newUser.password = undefined;

    const token = generateTokens({ id: newUser.id });
    responseHandler.created(res, {
      ...token,
      newUser,
    });
  } catch {
    responseHandler.error(res);
  }
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // check account exists
    if (!user)
      return responseHandler.badrequest(res, "Incorret email or password");

    // check password
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid)
      return responseHandler.badrequest(res, "Incorret password");
    user.password = undefined;
    // login success
    const token = generateTokens({ id: user.id });
    setTimeout(() => {
      responseHandler.ok(res, {
        ...token,
        user,
        id: user.id,
      });
    }, 1000);
  } catch {
    responseHandler.error(res);
  }
};

// refresh token
export const refreshToken = async (req, res) => {
  const refreshToken = req.body.rftoken;
  if (!refreshToken) {
    responseHandler.badrequest(res, "You're not authenticated");
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) return res.status(401).json("Unauthorized");
    // create new token
    const newToken = generateTokens({ id: user.id });

    responseHandler.ok(res, { ...newToken });
  });
};

// logout
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  responseHandler.ok(res);
};
