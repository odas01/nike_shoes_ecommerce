import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";

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

    if (user.authType !== "local") {
      return responseHandler.badrequest(res, "Incorret email or password");
    }

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
      });
    }, 1000);
  } catch {
    responseHandler.error(res);
  }
};

// google login
export const googleLogin = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  const accessToken = bearerHeader.split(" ")[1];

  axios
    .get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async ({ data }) => {
      const user = await User.findOne({ email: data.email });
      if (user) {
        const token = generateTokens({ id: user.id });
        responseHandler.ok(res, { ...token, user });
      } else {
        // resgis success
        const newUser = await User.create({
          fullname: data.name,
          email: data.email,
          authId: data.sub,
          authType: "google",
          authAvatar: data.picture,
        });
        const token = generateTokens({ id: newUser.id });
        responseHandler.ok(res, { ...token, user: newUser });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Invalid access token!" });
    });
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
