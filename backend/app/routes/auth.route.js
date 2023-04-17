import express from "express";
import { verifyUser } from "../middleware/verify.middleware.js";
import * as auth from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);

router.post("/googleLogin", auth.googleLogin);

router.post("/refresh", auth.refreshToken);
router.get("/activeUser", verifyUser, (req, res) => {
  res.send({ user: req.user });
});

router.post("/logout", auth.logout);

export default router;
