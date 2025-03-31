import express from "express"
import doctorController from "../controllers/doctorController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

//@ts-ignore
router.get("/page-doctors" , doctorController.getDocPaginated)
//@ts-ignore
router.post("/register" , authMiddleware.isAuthenticated , adminMiddleware, doctorController.createDoc)
//@ts-ignore
router.get("/" , doctorController.getAllDoc)
//@ts-ignore
router.get("/:id" ,authMiddleware.isAuthenticated, doctorController.getDocById)
//@ts-ignore
router.put("/:id" ,authMiddleware.isAuthenticated,adminMiddleware, doctorController.updateDoc)


export default router
