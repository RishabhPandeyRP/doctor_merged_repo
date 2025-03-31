import db from "../config/db.js"

interface Doctor {
    id?: number;
    user_id: number;
    specialty: string;
    experience: number;
    photo_url?: string;
    rating?: number;
    location: string;
    gender: "male" | "female" | "other";
    diseases?: string[];
}

const doctorModel = {
    createDoc: async (doctor: Doctor) => {
        const { user_id, specialty, experience, photo_url, location, gender, diseases, rating } = doctor;

        const response = await db.query("insert into doctors (user_id, specialty, experience, photo_url, location, gender, diseases, rating) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *", [user_id, specialty, experience, photo_url, location, gender, diseases, rating])

        return response.rows[0]
    },

    getAllDoc: async () => {
        const response = await db.query("select doctors.* , users.name as doctor_name from doctors inner join users on doctors.user_id = users.id")
        return response.rows
    },

    getDocById: async (id: number) => {
        const response = await db.query("select doctors.* , users.name as doctor_name from doctors inner join users on doctors.user_id = users.id where doctors.id=$1", [id])
        return response.rows[0]
    },

    updateDoc: async (id: number, updates: Partial<Doctor>) => {
        const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(", ");
        const values = Object.values(updates);

        const query = `UPDATE doctors SET ${fields} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id, ...values]);
        return result.rows[0];
    },

    getDocPaginated: async (page: number, limit: number = 6, search?: string, rating?: string[], experience?: string[], gender?: string[]) => {
        try {
            const offset = (page - 1) * limit
            let query = `select doctors.* , users.name as doctor_name from doctors inner join users on doctors.user_id = users.id where 1=1 `
            let queryParams: any[] = []

            if (search) {
                queryParams.push(`%${search}%`)
                query += `and (specialty ilike $${queryParams.length} or users.name ilike $${queryParams.length} or exists (
            select 1 from unnest(doctors.diseases) as disease
            where disease ilike $${queryParams.length}
        )) `
            }

            if (rating && rating.length) {
                queryParams.push(rating)
                query += `and rating = any($${queryParams.length}) `
            }

            if (experience && experience.length) {
                queryParams.push(experience)
                query += `and experience = any($${queryParams.length}) `
            }

            if (gender && gender.length) {
                queryParams.push(gender)
                query += `and gender = any($${queryParams.length}) `
            }


            query += `order by rating desc limit $${queryParams.length + 1} offset $${queryParams.length + 2} `
            queryParams.push(limit, offset)

            const { rows } = await db.query(query, queryParams)

            const rowCount = "select count(*) from doctors inner join users on doctors.user_id = users.id where 1=1"

            const totalRes = await db.query(rowCount)
            const total = parseInt(totalRes.rows[0].count)
            return { doctors: rows, total }

        } catch (error: any) {
            console.log("error in sql model", error.message)
            throw error
        }
    }
}

export default doctorModel