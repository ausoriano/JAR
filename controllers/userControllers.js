import { uploadPicture } from "../middleware/uploadPicture.js";
import User from "../models/User.js";
import { fileRemover } from "../utils/fileRemover.js";
const registerUser = async (req, res, next) => {
   try {
      const { name, email, password } = req.body;

      // Check if user already exists or not
      let user = await User.findOne({ email });
      if (user) {
         throw new Error("User already exists");
      }
      // Creating a new user
      user = await User.create({ name, email, password });
      return res.status(201).json({
         _id: user._id,
         avatar: user.avatar,
         name: user.name,
         email: user.email,
         verified: user.verified,
         // admin: user.admin,
         role: user.role,
         token: await user.getJWTToken(),
      });
   } catch (error) {
      next(error);
   }
};

// Login User
const loginUser = async (req, res, next) => {
   try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });

      // Condition for the user
      if (!user) {
         throw new Error("Email not registered, you might need to register");
      }

      if (await user.comparePassword(password)) {
         return res.status(200).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            // admin: user.admin,
            role: user.role,
            token: await user.getJWTToken(),
         });
      } else {
         throw new Error("Password Credentials do not match");
      }
   } catch (error) {
      next(error);
   }
};

// User Profile
const userProfile = async (req, res, next) => {
   try {
      let user = await User.findById(req.user._id);

      if (user) {
         return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            // admin: user.admin,
            role: user.role,
         });
      } else {
         let error = new Error("User not found");
         error.statusCode = 404;
         next(error);
      }
   } catch (error) {
      next(error);
   }
};

// Update Profile Controller
const updateProfile = async (req, res, next) => {
   try {
      // Finding the user
      let user = await User.findById(req.user._id);

      //  Checking if user exists
      if (!user) {
         throw new Error("User not found");
      }

      //   Updating the the fields of the user,
      // the sign  || meaning if the field is empty use the existed user name or email
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      //  Checking if the password must be true if the password is greater than 6
      if (req.body.password && req.body.password.length < 6) {
         throw new Error("Password must be at least 6 characters");
      } else if (req.body.password) {
         // if the password is not empty then update it
         user.password = req.body.password;
      }

      // Saving the user changes
      const updatedUserProfile = await user.save();

      res.json({
         _id: updatedUserProfile._id,
         avatar: updatedUserProfile.avatar,
         name: updatedUserProfile.name,
         email: updatedUserProfile.email,
         verified: updatedUserProfile.verified,
         // admin: updatedUserProfile.admin,
         role: updatedUserProfile.role,
         token: await updatedUserProfile.getJWTToken(),
      });
   } catch (error) {
      next(error);
   }
};

// Update Profile Picture
const updateProfilePicture = async (req, res, next) => {
   try {
      const upload = uploadPicture.single("profilePicture");
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
               let updatedUser = await User.findById(req.user._id);
               filename = updatedUser.avatar;
               if (filename) {
                  //  it well remove the previous file and replace with the new files
                  fileRemover(filename);
               }
               updatedUser.avatar = req.file.filename;
               await updatedUser.save();
               res.json({
                  _id: updatedUser._id,
                  avatar: updatedUser.avatar,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  verified: updatedUser.verified,
                  // admin: updatedUser.admin,
                  role: updatedUser.role,
                  token: await updatedUser.getJWTToken(),
               });
            } else {
               let filename;
               let updatedUser = await User.findById(req.user._id);
               //  getting the file name base on the filename that user uploaded
               filename = updatedUser.avatar;
               // if the is no file in profilePicture Field
               updatedUser.avatar = "";
               //Saving the changes to the database
               await updatedUser.save();
               //  it well remove the previous file and replace with the new files
               fileRemover(filename);
               res.json({
                  _id: updatedUser._id,
                  avatar: updatedUser.avatar,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  verified: updatedUser.verified,
                  // admin: updatedUser.admin,
                  role: updatedUser.role,
                  token: await updatedUser.getJWTToken(),
               });
            }
         }
      });
   } catch (error) {
      next(error);
   }
};

// Exporting all Controllers
export {
   registerUser,
   loginUser,
   userProfile,
   updateProfile,
   updateProfilePicture,
};
