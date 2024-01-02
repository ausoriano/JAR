import { Schema, model } from "mongoose";

// Create user schema
const CommentSchema = new Schema(
   {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      desc: { type: String, required: true },
      post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
      // check set to false to hide first the comment changing this to true to show
      check: { type: Boolean, default: false },
      parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
      replyOnUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
   },
   { timestamps: true, toJSON: { virtuals: true } }
);

// Creating relation between post and comment
CommentSchema.virtual("replies", {
   ref: "Comment",
   localField: "_id",
   foreignField: "parent",
});
// Create user model

const Comment = model("Comment", CommentSchema);

export default Comment;
