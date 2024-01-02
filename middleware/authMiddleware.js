import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect the routes of userProfile
const authGuard = async (req, res, next) => {
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      try {
         const token = req.headers.authorization.split(" ")[1];
         const { id } = jwt.verify(token, process.env.JWT_SECRET);

         const user = await User.findById(id).select("-password");

         if (!user) {
            let error = new Error("User not found");
            error.statusCode = 404;
            console.error("User not found:", { id }); // Log user not found
            return next(error);
         }

         req.user = user;
         next();
      } catch (error) {
         console.error("Authentication error:", error); // Log authentication error
         let err = new Error("Not authorized, Token is not valid");
         err.statusCode = 401;
         next(err);
      }
   } else {
      let error = new Error("Not authorized, No token");
      error.statusCode = 401;
      next(error);
   }
};

const adminGuard = (req, res, next) => {
   if (req.user && req.user.role === "admin") {
      next();
   } else {
      let error = new Error("Not authorized as an admins");
      error.statusCode = 401;
      next(error);
   }
};

// const userGuard = (req, res, next) => {
//    if (req.user && req.user.role === "user") {
//       if (
//          req.method === "POST" ||
//          req.method === "PUT" ||
//          req.method === "DELETE"
//       ) {
//          next(); // Allow POST, EDIT, and DELETE for users
//       } else {
//          let error = new Error("Not authorized for this action");
//          error.statusCode = 403;
//          next(error);
//       }
//    } else {
//       let error = new Error("Not authorized as a user");
//       error.statusCode = 401;
//       next(error);
//    }
// };

const canCUDPostsGuard = (req, res, next) => {
   const allowedRoles = ["admin", "moderator", "user"];

   if (req.user && allowedRoles.includes(req.user.role)) {
      if (
         req.method === "POST" ||
         req.method === "PUT" ||
         req.method === "DELETE"
      ) {
         next(); // Allow create, update, delete actions for these roles
      } else {
         let error = new Error("Not authorized for this method");
         error.statusCode = 405;
         next(error);
      }
   } else {
      let error = new Error("Not authorized for this action");
      error.statusCode = 403;
      next(error);
   }
};

export { authGuard, adminGuard, canCUDPostsGuard };
