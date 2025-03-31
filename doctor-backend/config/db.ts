import dotenv from "dotenv";
dotenv.config();
import pkg from "pg"
const {Pool} = pkg
const dbUrl = process.env.dbConnectionUrl || "postgresql://neondb_owner:npg_yKUhdIcZ2S1z@ep-lucky-glade-a5jeosq1-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
})

pool.query("select now()" , (err , res)=>{
    if(err){
        console.log(dbUrl)
        console.error("db connect err " , err)
    }
    else{
        console.log("connected with db" , res.rows[0])
    }
})

export default {
    query: (text: string, params?: any[]) => pool.query(text, params),
  };
  