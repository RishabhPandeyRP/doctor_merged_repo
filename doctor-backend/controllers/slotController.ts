import slotService from "../services/slotService.js";
import { Request,Response } from "express";

const slotController = {
    createSlot: async(req : Request,res : Response)=>{
        try {
            const {doctor_id , date} = req.body
            const response = await slotService.registerSlots(doctor_id , date)

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error: slotController > createslot")
        } catch (error:any) {
            console.log("error: slotController > createslot" , error.message)
            res.status(500).json({message:error.message})
        }
    },

    getSlotByDocId: async(req : Request,res : Response)=>{
        try {
            console.log("date from the backend is : " , req.params.date)
            const response = await slotService.getSlotByDocId(Number(req.params.doctor_id) , (req.params.date))

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error: slotController > getSlotByDocId")
        } catch (error:any) {
            console.log("error: slotController > getSlotByDocId" , error.message)
            res.status(500).json({message:error.message})
        }
    },

    deleteSlot: async(req : Request,res : Response)=>{
        try {
            const response = await slotService.deleteSlot(Number(req.params.id) , Number(req.params.doctor_id))

            if(response.success){
                return res.status(200).json(response.data)
            }else throw new Error("error: slotController > deleteSlot")
        } catch (error:any) {
            console.log("error: slotController > deleteSlot" , error.message)
            res.status(500).json({message:error.message})
        }
    },
}

export default slotController