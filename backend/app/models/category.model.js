import mongoose, { Schema } from "mongoose";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug, {
  custom: {
    and: "",
  },
});

export default mongoose.model(
  "Category",
  Schema(
    {
      name: { type: String, unique: true },
      slug: { type: String, slug: "name" },
      genders: [{ type: String }],
      thumbnail: { type: Schema.Types.ObjectId, ref: "Gallery" },
    },
    { timestamps: true }
  )
);
