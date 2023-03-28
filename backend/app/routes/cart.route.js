import express from "express";

import * as cart from "../controller/cart.controller.js";

const router = express.Router();

router.route("/").get(cart.getOne).post(cart.create).delete(cart.deleteOne);

router.route("/:itemId").put(cart.updateItem).delete(cart.deleteItem);

export default router;
