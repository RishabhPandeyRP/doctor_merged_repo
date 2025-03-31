import express from "express"
import slotController from "../controllers/slotController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

//@ts-ignore
router.post("/generate" , authMiddleware.isAuthenticated , adminMiddleware, slotController.createSlot)
//@ts-ignore
router.get("/:doctor_id/:date" ,authMiddleware.isAuthenticated, slotController.getSlotByDocId)
//@ts-ignore
router.delete("/:id/:doctor_id" ,authMiddleware.isAuthenticated,adminMiddleware, slotController.deleteSlot)


export default router
