import express from "express";

import * as user from "../controller/user.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/verify.middleware.js";

const router = express.Router();

router.route("/search").get(user.search);

router
  .route("/:id")
  .get(verifyUser, user.getOne)
  .put(verifyUser, user.updateOne)
  .delete(verifyAdmin, user.deleteOne);

router.route("/").get(verifyAdmin, user.getAll);

export default router;
