import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig.js";
import dotenv from "dotenv";
dotenv.config()



const imageUploadController = {
    uploadImage: async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "no file for uploading" })
            }
            const fileBuffer = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            const response = await cloudinary.uploader.upload(fileBuffer)
            res.status(200).json({ message: "image uploaded", url: response.url })
        } catch (error: any) {
            console.error("Upload error:", error.message);
            res.status(500).json({ message: "Upload failed", error: error.message });
        }
    }
}

export default imageUploadController