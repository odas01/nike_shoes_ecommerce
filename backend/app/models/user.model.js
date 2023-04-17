import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "User",
  mongoose.Schema(
    {
      fullname: { type: String },
      email: { type: String, required: true, unique: true, lowercase: true },
      authType: {
        type: String,
        enum: ["local", "facebook", "google"],
        default: "local",
      },
      authId: {
        type: String,
      },
      authAvatar: {
        type: String,
      },
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
