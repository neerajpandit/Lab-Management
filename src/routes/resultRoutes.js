import express from "express";
import { validateLabData } from "../middlewares/inputValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addPatientWithTest, getPatient,updateTestResults } from "../controllers/resultController.js";

const router = express.Router();

router.post("/add-patient-test",verifyToken,addPatientWithTest);
router.get("/test-result/:id",getPatient);
router.put("/update-test-result/:id",verifyToken,updateTestResults);


export default router;