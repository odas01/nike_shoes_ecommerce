import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "User",
  mongoose.Schema(
    {
      fullname: { type: String },
      email: { type: String, unique: true, lowercase: true },
      avatar: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      password: { type: String },
      phone: { type: String },
      address: { type: String },
      specificAddress: { type: String },
      admin: { type: Boolean, default: false },
      blocked: { type: Boolean, default: false },
      deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
