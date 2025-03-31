import express from "express"
import appointmentController from "../controllers/appointmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

//@ts-ignore
router.post("/book" ,authMiddleware.isAuthenticated , appointmentController.bookAppointment)
//@ts-ignore
router.get("/patient/:patient_id" , appointmentController.getAppByPatient)
//@ts-ignore
router.get("/getAll" , appointmentController.getAllApp)
//@ts-ignore
router.get("/doctor/:doctor_id" , appointmentController.getAppByDoc)
//@ts-ignore
router.put("/:id/status" ,authMiddleware.isAuthenticated , adminMiddleware, appointmentController.updateApp)
//@ts-ignore
router.delete("/:id" ,authMiddleware.isAuthenticated , adminMiddleware, appointmentController.deleteApp)


export default router
