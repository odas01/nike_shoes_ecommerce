import express from "express";
import * as order from "../controller/order.controller.js";
const router = express.Router();
import { verifyAdmin, verifyUser } from "../middleware/verify.middleware.js";

router
  .route("/")
  .post(verifyUser, order.create)
  .get(
    // verifyAdmin,
    order.getAll
  )
  .delete(order.deleteAll);

router.route("/search").get(order.search);

router.route("/user/:userId").get(order.getByUser);

router
  .route("/:id")
  .get(order.getOne)
  .put(order.updateOne)
  .delete(order.deleteOne);

export default router;
