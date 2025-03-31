import appointmentService from "../services/appointmentService.js";
import { Request,Response } from "express";

const appointmentController = {

    bookAppointment : async(req:Request , res:Response)=>{
        try {
            const response = await appointmentService.bookAppointment(req.body)

            if(response.success){
                return res.status(200).json(response.data)
            }
            res.status(200).json(response.data)
        } catch (error:any) {
            console.log("error : appController > book" , error.message)
            res.status(500).json({message : error.message})
        }
    },

    getAllApp : async(req:Request , res:Response)=>{
        try {
            const response = await appointmentService.getAllApp()

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error : appController > get all app")
        } catch (error:any) {
            console.log("error : appController > get all app" , error.message)
            res.status(500).json({message : error.message})
        }
    },

    getAppByPatient : async(req:Request , res:Response)=>{
        try {
            const response = await appointmentService.getAppByPatient(Number(req.params.patient_id))

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error : appController > book")
        } catch (error:any) {
            console.log("error : appController > book" , error.message)
            res.status(500).json({message : error.message})
        }
    },

    getAppByDoc : async(req:Request , res:Response)=>{
        try {
            const response = await appointmentService.getAppByDoc(Number(req.params.doctor_id))

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error : appController > book")
        } catch (error:any) {
            console.log("error : appController > book" , error.message)
            res.status(500).json({message : error.message})
        }
    },

    updateApp : async(req:Request , res:Response)=>{
        try {
            const response = await appointmentService.updateApp(Number(req.params.id) , req.body.status)

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error : appController > book")
        } catch (error:any) {
            console.log("error : appController > book" , error.message)
            res.status(500).json({message : error.message})
        }
    },

    deleteApp : async(req:Request , res:Response)=>{
        try {
            const response = await appointmentService.deleteApp(Number(req.params.id))

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error : appController > book")
        } catch (error:any) {
            console.log("error : appController > book" , error.message)
            res.status(500).json({message : error.message})
        }
    },

}

export default appointmentController