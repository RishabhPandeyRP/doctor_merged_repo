import appointmentModel from "../models/appointmentModel.js";

const appointmentService = {
    bookAppointment : async(appData:any)=>{
        try {
            const response = await appointmentModel.bookAppointment(appData)

            return {success:true , data:response}

        } catch (error:any) {
            console.log("error: app service > book" , error.message)
            return {success:false , data:error.message}
        }
    },

    getAllApp : async()=>{
        try {
            const response = await appointmentModel.getAllApp()

            const updatedResponse = response.map((slot) => {
                let dateStr = String(slot.appointment_date)
                const date = new Date(dateStr)
                let fornmatted = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                let dateString = `${fornmatted.getFullYear()}-${String(fornmatted.getMonth() + 1).padStart(2, '0')}-${String(fornmatted.getDate()).padStart(2, '0')}T00:00:00.000Z`

                return { ...slot, newdate: dateString };
            });

            return {success:true , data:updatedResponse}
        } catch (error:any) {
            console.log("error: app service > get all app" , error.message)
            return {success:false , data:error.message}
        }
    },

    getAppByPatient : async(patient_id:number)=>{
        try {
            const response = await appointmentModel.getAppByPatient(patient_id)

            const updatedResponse = response.map((slot) => {
                let dateStr = String(slot.appointment_date)
                const date = new Date(dateStr)
                let fornmatted = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                let dateString = `${fornmatted.getFullYear()}-${String(fornmatted.getMonth() + 1).padStart(2, '0')}-${String(fornmatted.getDate()).padStart(2, '0')}T00:00:00.000Z`

                return { ...slot, newdate: dateString }; 
            });

            return {success:true , data:updatedResponse}
        } catch (error:any) {
            console.log("error: app service > get by patient" , error.message)
            return {success:false , data:error.message}
        }
    },

    getAppByDoc : async(doctor_id:number)=>{
        try {
            const response = await appointmentModel.getAppByDoc(doctor_id)

            return {success:true , data:response}
        } catch (error:any) {
            console.log("error: app service > get by doc" , error.message)
            return {success:false , data:error.message}
        }
    },

    updateApp : async(id:number,status:string)=>{
        try {
            const response = await appointmentModel.updateApp(id,status)

            return {success:true , data:response}
        } catch (error:any) {
            console.log("error: app service > update" , error.message)
            return {success:false , data:error.message}
        }
    },

    deleteApp : async(id:number)=>{
        try {
            const response = await appointmentModel.deleteApp(id)

            return {success:true , data:response}
        } catch (error:any) {
            console.log("error: app service > delete" , error.message)
            return {success:false , data:error.message}
        }
    },

}

export default appointmentService