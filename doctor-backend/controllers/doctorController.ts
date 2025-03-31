import {Request , Response} from "express"
import doctorService from "../services/doctorService.js"

const doctorController = {
    createDoc: async(req:Request , res:Response)=>{
        try {
            const response = await doctorService.createDoc(req.body)
            
            if(response.success){
                return res.status(200).json({docname:response.data})
            }
            else throw new Error("from docController > create")
        } catch (error:any) {
            console.log("from docController > create" , error.message)
            res.status(500).json({message :error.message ||  "error in controller doc"})
        }
    },


    getAllDoc: async(req:Request , res:Response)=>{
        try {
            const response = await doctorService.getAllDoc()
            if(response.success){
                return res.status(200).json({docname:response.data})
            }
            else throw new Error("from docController > getall")
        } catch (error:any) {
            console.log("from docController > getall" , error.message)
            res.status(500).json({message :error.message ||  "error in controller getall"})
        }
    },

    getDocById: async(req:Request , res:Response)=>{
        try {
            const response = await doctorService.getDocById(Number(req.params.id))
            if (!response) return res.status(404).json({ message: "Doctor not found" });
            if(response.success){
                return res.status(200).json({docname:response.data})
            }
            else throw new Error("from docController > get by id")
        } catch (error:any) {
            console.log("from docController > get by id" , error.message)
            res.status(500).json({message :error.message ||  "error in doc controller get by id"})
        }
    },

    updateDoc: async(req:Request , res:Response)=>{
        try {
            const response = await doctorService.updateDoc(Number(req.params.id) , req.body)
            
            if(response.success){
                return res.status(200).json({updated_docname:response.data})
            }
            else throw new Error("from docController > getall")
        } catch (error:any) {
            console.log("from docController > update" , error.message)
            res.status(500).json({message :error.message ||  "error in doc controller update"})
        }
    },

    getDocPaginated : async(req:Request , res:Response)=>{
        try {
            const {page = "1" , limit = "6" , search , rating ,experience , gender} = req.query

            const parsedPage = parseInt(page as string)
            const parsedLimit = parseInt(limit as string)

            const parsedRating : string[] = Array.isArray(rating) ? rating.map(item => item as string).filter(item => item.trim() !== "")  : []

            const parsedExp : string[] = Array.isArray(experience) ? experience.map(item => item as string).filter(item => item.trim() !== "") : []

            const parsedGender : string[] = Array.isArray(gender) ? gender.map(item => item as string).filter(item => item.trim() !== "") : []

            const response = await doctorService.getDocPaginated(parsedPage , parsedLimit , search as string , parsedRating , parsedExp , parsedGender)

            if(response.success){
                return res.status(200).json({docname:response.data})
            }

            res.status(500).json({message:"some error occured while getting doctors"})
        } catch (error:any) {
            console.log("error:doc controller > getdoc paginated")
            res.status(500).json({message : error.message})
        }
    }


}

export default doctorController