import { uploadPicture } from "../middleware/uploadPicture.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import util from "util";

// const createPost = async (req, res, next) => {
//    try {
//       const { title, caption } = req.body;
//       const post = new Post({
//          title,
//          caption,
//          slug: uuidv4(),
//          body: {
//             type: "doc",
//             content: [],
//          },
//          photo: "",
//          user: req.user._id,
//       });

//       const createdPost = await post.save();
//       return res.json(createdPost);
//    } catch (error) {
//       next(error);
//    }
// };

const createPost = async (req, res, next) => {
   try {
      const upload = util.promisify(uploadPicture.single("photo"));
      await upload(req, res);

      // Validate that title and caption are present in the request body
      if (!req.body.title || !req.body.caption) {
         console.log("Missing title or caption in the request body:", req.body);
         return res
            .status(400)
            .json({ error: "Title and caption are required." });
      }

      // Everything went well
      let filename = "";

      if (req.file) {
         filename = req.file.filename;
      }

      const { title, caption } = req.body;
      console.log(
         "Received request with title:",
         title,
         "and caption:",
         caption
      );

      const post = new Post({
         title,
         caption,
         slug: uuidv4(),
         body: {
            type: "doc",
            content: [],
         },
         photo: filename,
         user: req.user._id,
      });

      const createdPost = await post.save();
      console.log("Post created:", createdPost);
      return res.json(createdPost);
   } catch (error) {
      console.error("Error in createPost:", error);
      next(error);
   }
};

// updating post controllers

const updatePost = async (req, res, next) => {
   try {
      const post = await Post.findOne({ slug: req.params.slug });
      if (!post) {
         throw new Error("Post not found");
      }

      //  updating the picture of the post

      const handleUpdatePostData = async (data) => {
         const { title, caption, slug, body, tags, categories } =
            JSON.parse(data);
         post.title = title || post.title;
         post.caption = caption || post.caption;
         post.slug = slug || post.slug;
         post.body = body || post.body;
         post.tags = tags || post.tags;
         post.categories = categories || post.categories;
         const updatedPost = await post.save();
         return res.json(updatedPost);
      };
      upload(req, res, async function (err) {
         if (err) {
            const error = new Error(
               "An unknown error occured when uploading " + err.message
            );
            next(error);
         } else {
            // every thing went well
            if (req.file) {
               let filename;
               filename = post.photo;
               if (filename) {
                  fileRemover(filename);
               }
               post.photo = req.file.filename;
               handleUpdatePostData(req.body.document);
            } else {
               let filename;
               filename = post.photo;
               post.photo = "";
               fileRemover(filename);
               handleUpdatePostData(req.body.document);
            }
         }
      });
   } catch (error) {
      next(error);
   }
};

const deletePost = async (req, res, next) => {
   try {
      // Find that post and delete it
      const post = await Post.findOneAndDelete({ slug: req.params.slug });

      if (!post) {
         const error = new Error("Post was not found");
         return next(error);
      }
      // delete the comments under that post
      await Comment.deleteMany({ post: post._id });

      return res.json({
         message: "Post deleted successfully",
      });
   } catch (error) {
      next(error);
   }
};

const getPost = async (req, res, next) => {
   try {
      const post = await Post.findOne({ slug: req.params.slug }).populate([
         // getting info from user and categories
         {
            path: "user",
            select: ["avatar", "name", "role"],
         },
         //  {
         //     path: "categories",
         //     select: ["title"],
         //  },
         {
            path: "comments",
            match: {
               check: true,
               parent: null,
            },
            // this populate is for the replies
            populate: [
               {
                  path: "user",
                  select: ["avatar", "name"],
               },
               {
                  path: "replies",
                  match: {
                     check: true,
                  },
                  populate: [
                     {
                        path: "user",
                        select: ["avatar", "name"],
                     },
                  ],
               },
            ],
         },
      ]);

      if (!post) {
         const error = new Error("Post was not found");
         return next(error);
      }

      return res.json(post);
   } catch (error) {
      next(error);
   }
};

// Get all posts
const getAllPosts = async (req, res, next) => {
   try {
      const posts = await Post.find({}).populate([
         {
            path: "user",
            select: ["avatar", "name", "verified"],
         },
      ]);

      res.json(posts);
   } catch (error) {
      next(error);
   }
};

// Exporting all Controllers
export { createPost, updatePost, deletePost, getPost, getAllPosts };
