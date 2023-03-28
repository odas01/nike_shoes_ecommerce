import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "OrderDetail",
  mongoose.Schema({
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    size: { type: Number },
    qty: { type: Number },
    total: { type: Number },
  })
);
