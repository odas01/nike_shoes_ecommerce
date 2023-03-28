import mongoose, { Schema } from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

export default mongoose.model(
  "Product",
  Schema(
    {
      title: { type: String },
      subTitle: { type: String },
      slug: { type: String, slug: "title", unique: true },
      description: { type: String, default: "" },
      genders: [{ type: String }],
      category: { type: String },
      price: { type: Number, default: 0 },
      options: [{ type: Object }],
      thumbnail: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      images: [{ type: Schema.Types.ObjectId, ref: "Gallery" }],
      published: { type: Boolean, default: true },
      deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
