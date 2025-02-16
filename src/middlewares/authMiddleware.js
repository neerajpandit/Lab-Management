import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./ApiError.js";

// Middleware to verify the JWT access token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    // req.header('Authorization')?.split(' ')[1]; // Authorization header format: "Bearer <token>"
    // console.log(token);

    if (!token)
      return res.status(401).json({ message: "Access token is required" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({ message: "Invalid or expired token" });
      // console.log(decoded);
      
      req.userDetails = decoded;
      req.userId=decoded.id;
      // console.log(req.userId);

      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.log("error in verify token", error);
  }
};

//Admin verify
export const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = req.userDetails; 

    if (user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
    next(); 
  } catch (error) {
    next(error); 
  }
});

//Lab Admin verify
export const isLabAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = req.userDetails; 

    if (user.role !== "lab_owner") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }
    next(); 
  } catch (error) {
    next(error); 
  }
});


// export const verifyToken =async (req, _, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     // console.log(token);
//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// console.log(decodedToken);

//     // const user = await User.findById(decodedToken?._id).select(
//     //   "-password -refreshToken"
//     // );

//     // if (!user) {
//     //   throw new ApiError(401, "Invalid Access Token");
//     // }

//     // req.user = user;
//     next();
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// };

// export const isAdmin = asyncHandler(async (req, res, next) => {
//   try {
//     const user = req.user; // Get user information attached to the request

//     // Check if the user is an admin
//     if (user.role !== "admin") {
//       throw new ApiError(403, "You are not authorized to perform this action");
//     }

//     next(); // User is admin, proceed to the next middleware or route handler
//   } catch (error) {
//     next(error); // Pass any errors to the error handler middleware
//   }
// });

// export const accessToken = async (id, email, role) => {
//   return new Promise((resolve, reject) => {
//     jwt.sign(
//       { userId: id, email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.ACEESS_TOKEN_EXPIRE },
//       (err, token) => {
//         if (err) reject(err);
//         resolve(token);
//       }
//     );
//   });
// };

// export const refreshToken = async (id) => {
//   return new Promise((resolve, reject) => {
//     jwt.sign(
//       { userId: id },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
//       (err, token) => {
//         if (err) reject(err);
//         resolve(token);
//       }
//     );
//   });
// };
