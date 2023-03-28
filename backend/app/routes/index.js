import express from "express";
const router = express.Router();

import { verifyUser } from "../middleware/verify.middleware.js";

import authRoute from "./auth.route.js";
import cartRoute from "./cart.route.js";
import userRoute from "./user.route.js";
import productRoute from "./product.route.js";
import categoryRoute from "./category.route.js";
import orderRoute from "./order.route.js";

router.use("/auth", authRoute);
router.use("/carts", verifyUser, cartRoute);
router.use("/users", userRoute);
router.use("/products", productRoute);
router.use("/category", categoryRoute);
router.use("/orders", orderRoute);

export default router;
