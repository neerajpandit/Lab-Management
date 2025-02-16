import pool from "../config/db.js";
import { ApiError } from "../middlewares/ApiError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
// import { accessToken, refreshToken } from "../middlewares/authMiddleware.js";
import { uploadFileToS3 } from "../middlewares/multeraws.js";
import { handleResponse } from "../middlewares/responseHandler.js";
import { generateAccessAndRefreshTokens } from "../middlewares/tokenService.js";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  loginUserService,
  logoutUserService,
  updateUserService,
} from "../models/userModel.js";



export const createUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;
  if (!fullName || !email || !phone || !password || !role) {
    return handleResponse(res, 400, "All fields are required");
  }
  try {
    const newUser = await createUserService(fullName, email, phone, password, role);
    handleResponse(res, 201, "User created successfully", newUser);
  } catch (err) {
    next(err);
  }
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {  
    return handleResponse(res, 400, "All fields are required");
  }
  const user = await loginUserService(email, password);
  if (!user) {
    throw new ApiError(404, "user Not found");
  }
  console.log(user.id);

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id, user.email, user.role
  );
// console.log(accessToken, refreshToken);


  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Secure and only accessible via HTTP
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: 1 * 24 * 60 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.set({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  // Send tokens in the response as well
  return res.status(200).json({
    message: "Login successful.",
    user,
    accessToken,
    refreshToken,
  });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    console.log("logout", req.userId);
    const user = await logoutUserService(req.userId);
    if (!user) return handleResponse(res, 404, "User Not Found");

    // Clear cookies
    const options = {
      httpOnly: true,
      secure: true, // Ensure this is used in production with HTTPS
      sameSite: "strict", // Helps mitigate CSRF
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    // Optionally clear authorization headers
    res.setHeader("Authorization", "");

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error); // Pass the error to the global error handler
  }
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "Users fetched successfully", users);
  } catch (err) {
    next(err);
  }
});

export const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "User not found");

    handleResponse(res, 200, "User fetched successfully", user);
  } catch (err) {
    next(err);
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email,phone,status } = req.body;
  try {
    const updatedUser = await updateUserService(req.params.id, name, email,phone,status);
    if (!updatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User deleted successfully", deleteUser);
  } catch (err) {
    next(err);
  }
});

export const createImage = asyncHandler(async (req, res, next) => {
  try {
    const fileKey = await uploadFileToS3(req.file);
    console.log("File Key",fileKey);
    
    const imgpath = `https://fundzz.s3.ap-south-1.amazonaws.com/${fileKey}`;


    if (!fileKey) {
      throw new ApiError("Find Error in upload img");
    }
    handleResponse(res, 201, "Img upload Successfully", imgpath);
  } catch (error) {
    next(error);
  }
});