import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "Order",
  mongoose.Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      fullname: { type: String },
      phone: { type: String },
      address: { type: String },
      specificAddress: { type: String },
      shippingCost: { type: Number },
      shippingMethod: { type: String },
      paymentMethod: { type: String, default: "COD" },
      note: { type: String, default: "nothing" },
      total: { type: Number },
      details: { type: Array },
      note: { type: String, default: "nothing" },
      status: { type: String, default: "pending" },
    },
    { timestamps: true }
  )
);
