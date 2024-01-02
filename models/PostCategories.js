import { Schema, model } from "mongoose";

// Create user schema
const PostCategoriesSchema = new Schema(
   {
      name: { type: String, required: true },
   },
   { timestamps: true }
);

// Create user model

const PostCategories = model("PostCategories", PostCategoriesSchema);

export default PostCategories;
