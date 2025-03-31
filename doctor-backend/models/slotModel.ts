import db from "../config/db.js";

interface SlotInterface {
    id?: number;
    doctor_id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_available?: boolean;
}

const slotModel = {
    createSlots: async (slots: SlotInterface[]) => {
        const values = slots.map(slot => [
            slot.doctor_id,
            slot.date,
            slot.start_time,
            slot.end_time,
            slot.is_available || true
        ])

        const query = `
            INSERT INTO doctor_slots (doctor_id, date, start_time, end_time, is_available)
            VALUES ${values.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(", ")}
            RETURNING *;
         `;
        const response =await db.query(query , values.flat())
        return response.rows
    },

    getSlotByDoc: async(doctor_id:number , date:string)=>{
        console.log("date from model is " , date)
        const response = await db.query("select * from doctor_slots where doctor_id=$1 and date=$2 order by start_time" , [doctor_id,date])

        return response.rows

    },

    deleteSlots: async(id:number , doctor_id:number)=>{
        const response = await db.query("delete from doctor_slots where id = $1 and doctor_id = $2" , [id , doctor_id])

        return response.rows[0]
    }
}

export default slotModel