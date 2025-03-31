import db from "./config/db.js"
import bcrypt from 'bcrypt'

const seedSuperAdmin = async()=>{
    const email = "rishabh@gmail.com"
    const password = "rishabh123"

    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt);

    await db.query(`INSERT INTO users (email, password, role, name) 
     VALUES ($1, $2, 'admin', 'Super Admin')`,[email , encryptedPassword])

     console.log("Super admin seeded successfully")
}

seedSuperAdmin()