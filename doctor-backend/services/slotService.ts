import slotModel from "../models/slotModel.js";

const slotService = {
    createSlots(doctor_id: number, date: string, startTimeForSlots: string, endTimeForSlots: string) {
        const slotArray = [];
        let currentTime = new Date(`${date}T${startTimeForSlots}:00`);
        const endTime = new Date(`${date}T${endTimeForSlots}:00`);

        while (currentTime < endTime) {
            const start = currentTime.toTimeString().split(" ")[0];
            currentTime.setMinutes(currentTime.getMinutes() + 30);

            const end = currentTime.toTimeString().split(" ")[0];

            slotArray.push({ doctor_id, date, start_time: start, end_time: end, is_available: true });
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        return slotArray;
    },

    async registerSlots(doctor_id: number, date: string) {
        try {
            const morning = this.createSlots(doctor_id, date, "09:00", "12:00")
            const noon = this.createSlots(doctor_id, date, "15:00", "18:00")

            const allSlots = [...morning, ...noon]
            const response = await slotModel.createSlots(allSlots)
            return { success: true, data: response }
        } catch (error: any) {
            console.log("error:slotservice > registerSlot", error.message)
            return { success: false, data: error.message }
        }
    },

    getSlotByDocId: async (doctor_id: number, date: string) => {
        try {
            console.log("from service date is : ", date)
            const response = await slotModel.getSlotByDoc(doctor_id, date)

            const updatedResponse = response.map((slot) => {
                let dateStr = String(slot.date)
                const date = new Date(dateStr)
                let fornmatted = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
                let dateString = `${fornmatted.getFullYear()}-${String(fornmatted.getMonth() + 1).padStart(2, '0')}-${String(fornmatted.getDate()).padStart(2, '0')}T00:00:00.000Z`

                return { ...slot, newdate: dateString }; 
            });

            return { success: true, data: updatedResponse }
        } catch (error: any) {
            console.log("error : slotservice > getslotbydoc", error.message)
            return { success: false, data: error.message }
        }
    },

    deleteSlot: async (slot_id: number, doctor_id: number) => {
        try {
            const response = await slotModel.deleteSlots(slot_id, doctor_id)
            return { success: true, data: "slot deleted" }
        } catch (error: any) {
            console.log("error : slotservice > deleteslot", error.message)
            return { success: false, data: error.message }
        }
    }
}

export default slotService