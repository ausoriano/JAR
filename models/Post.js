import { Schema, model } from "mongoose";

// Create user schema
const PostSchema = new Schema(
   {
      title: { type: String, required: true },
      caption: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      body: { type: Object, required: true },
      photo: { type: String, required: false },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      tags: { type: [String] },
      categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }],
   },
   { timestamps: true, toJSON: { virtuals: true } }
);

// Creating relation between post and comment

PostSchema.virtual("comments", {
   ref: "Comment",
   localField: "_id",
   foreignField: "post",
});

// Create user model

const Post = model("Post", PostSchema);

export default Post;
