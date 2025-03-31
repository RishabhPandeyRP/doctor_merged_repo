import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import uploadController from "../controllers/imageUploadController.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router()

//@ts-ignore
router.post("/upload" ,authMiddleware.isAuthenticated , adminMiddleware, upload.single("image"),uploadController.uploadImage)

export default router