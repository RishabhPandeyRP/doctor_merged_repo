import express from "express";
import healthController from "../controllers/healthController.js";

const router = express.Router()

//@ts-ignore
router.get("/health" , healthController.healthCheck)

export default router