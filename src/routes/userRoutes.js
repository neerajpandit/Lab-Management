import express from "express";
import {
  createImage,
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/userController.js";
import {
  validateLogin,
  validateRegistration,
} from "../middlewares/inputValidator.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multeraws.js";

const router = express.Router();

router.post("/signup", validateRegistration, createUser);
router.post("/signin", validateLogin, loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.post("/uploadimg",upload,createImage);


export default router;
