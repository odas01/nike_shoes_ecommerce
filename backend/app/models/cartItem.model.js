import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "CartItem",
  mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      size: {
        type: Number,
      },
      qty: {
        type: Number,
      },
      stock: {
        type: Number,
      },
    },
    { timestamps: true }
  )
);
