import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.model.js";
import responseHandler from "../handler/response.handler.js";

const tokenDecode = (req) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")[1];
    try {
      const tokenDecoded = jsonwebtoken.verify(
        bearer,
        process.env.JWT_ACCESS_KEY
      );
      return tokenDecoded;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};
export const verifyUser = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id).select(
      "fullname email admin"
    );
    if (!user) return responseHandler.unauthorize(res);

    req.user = user;
    next();
  } else return responseHandler.unauthorize(res);
};

export const verifyAdmin = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id).select(
      "fullname email admin"
    );
    if (!user || !user.admin) return responseHandler.unauthorize(res);
    req.user = user;
    next();
  } else return responseHandler.unauthorize(res);
};
