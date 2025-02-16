import express from "express";
import { createLab, getAllLabsByOwnerId, getLabById,updateLab } from "../controllers/labController.js";
import { validateLabData } from "../middlewares/inputValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createlab",verifyToken,validateLabData,createLab);
router.get("/getlab/:id",verifyToken,getLabById);
router.get("/getalllabs",verifyToken,getAllLabsByOwnerId);
router.put("/updatelab/:id",verifyToken,validateLabData,updateLab);

export default router;