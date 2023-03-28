import express from "express";
import * as product from "../controller/product.controller.js";

import { verifyAdmin } from "../middleware/verify.middleware.js";
import filterProduct from "../middleware/filterProduct.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(verifyAdmin, product.create)
  .get(filterProduct, product.getAll);

router
  .route("/d/:slug")
  .get(product.getOne)
  .put(verifyAdmin, product.updateOne)
  .delete(verifyAdmin, product.deleteOne);

router.route("/related").get(product.related);
router.route("/popular").get(product.popular);

export default router;
