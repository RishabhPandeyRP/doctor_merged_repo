import doctorModel from "../models/doctorModel.js";

const doctorService = {
    createDoc : async (data:any)=>{
        try {
            const doctor  = await doctorModel.createDoc(data)
            return {success:true , data:doctor}
        } catch (error:any) {
            console.log("error: doc service > create" , error.message)
            return {success:false , data:error.message}
        }
    },

    getAllDoc : async()=>{
        try {
            const doctors  = await doctorModel.getAllDoc()
            return {success:true , data:doctors}
        } catch (error:any) {
            console.log("error: doc service > getall" , error.message)
            return {success:false , data:error.message}
        }
    },

    getDocById : async(id:number)=>{
        try {
            const doctor  = await doctorModel.getDocById(id)
            return {success:true , data:doctor}
        } catch (error:any) {
            console.log("error: doc service > getbyid" , error.message)
            return {success:false , data:error.message}
        }
    },

    updateDoc : async(id:number , updates:any)=>{
        try {
            const doctor  = await doctorModel.updateDoc(id,updates)
            return {success:true , data:doctor}
        } catch (error:any) {
            console.log("error: doc service > update" , error.message)
            return {success:false , data:error.message}
        }
    },

    getDocPaginated : async(page:number , limit:number = 6 , search?:string , rating?:string[] , experience?:string[] , gender?:string[])=>{
        try {
            const doctors = await doctorModel.getDocPaginated(page, limit , search , rating , experience , gender)
            return {success:true , data:doctors}
        } catch (error:any) {
            console.log("error : getDocPaginated > services")
            return {success:false , data:error.message}
        }
    }
}

export default doctorService