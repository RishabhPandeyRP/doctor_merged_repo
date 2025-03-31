import { Request, Response } from "express";

const healthController = {
    healthCheck : async(req:Request , res:Response)=>{
        try {
            
            res.status(200).json({message:"health fine!"})
        } catch (error:any) {
            console.log("Error while sending mail ", error.message)
            res.status(500).json({message : error.message || "error while health check"})
        }
    }
}

export default healthController