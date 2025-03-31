import db from "../config/db.js"

const userModel = {
    createUser : async (email:string , pass_encrypt:string , name:string , role:string)=>{
        const response = await db.query("insert into users (email , password , name , role) values ($1, $2, $3, $4) returning *" , [email,pass_encrypt,name,role])

        return response.rows[0]
    },

    findUserByEmail : async (email:string)=>{
        const response = await db.query("select * from users where email=$1" , [email])
        return response.rows[0]
    },

    updateResetToken : async(email:string , token:string , expiry_time:Date)=>{
        const response = await db.query("update users set reset_password_token = $1 , reset_password_expires = $2 where email = $3 returning *" ,[token,expiry_time,email])

        return response.rows[0]
    },

    isValidToken : async(email:string , token:string)=>{
        const response = await db.query("select reset_password_expires from users users where email = $1 and reset_password_token = $2" ,[email,token])

        return response
    },

    updateResetPassword : async(email:string , encryptPass:string)=>{
        const response = await db.query("update users set password = $2 , reset_password_token = null ,reset_password_expires = null where email = $1 ",[email,encryptPass])

        return response.rows[0]
    }
}

export default userModel