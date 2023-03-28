import mongoose, { Schema } from "mongoose";

export default mongoose.model(
  "Gallery",
  mongoose.Schema(
    {
      type: { type: String },
      public_id: {type: String},
      uid: {type: String},
      url: { type: String },
      format: { type: String },
    }
  )
);
