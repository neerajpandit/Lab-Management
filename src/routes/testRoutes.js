import express from "express";
// import { validateLabData } from "../middlewares/inputValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addTest } from "../controllers/testController.js";

const router = express.Router();

router.post("/addtest",verifyToken,addTest);


export default router;