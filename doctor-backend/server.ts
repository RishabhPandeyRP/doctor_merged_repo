    import express from "express";
    import cors from "cors";
    import helmet from "helmet";
    import morgan from "morgan";
    import dotenv from "dotenv";
    import authRoutes from "./routes/authRoutes.js";
    import docRoutes from "./routes/docRoutes.js"
    import slotRoutes from "./routes/slotRoutes.js"
    import appointmentRoutes from "./routes/appointmentRoutes.js"
    import imageUploadRoutes from "./routes/imageUploadRoute.js"
    import mailRoutes from "./routes/mailRoute.js"
    import healthRoutes from "./routes/healthRoutes.js"

    dotenv.config();
    const PORT = process.env.PORT || 5000
    const app = express()
    app.use(express.json())

    app.use(cors({
        origin:["https://doctor-admin-alpha-ten.vercel.app" , "https://doctor-appointment-frontend-sigma.vercel.app" , "http://localhost:3000" , "http://localhost:3001" , "https://doctor-merged-repo.vercel.app"],
        credentials:true
    }))

    app.use(helmet())
    app.use(morgan('dev'))

    app.use("/",healthRoutes)
    app.use("/auth" , authRoutes)
    app.use("/doctors" , docRoutes)
    app.use("/slots" , slotRoutes)
    app.use("/appointment" , appointmentRoutes)
    app.use("/api" , imageUploadRoutes)
    app.use("/api" , mailRoutes)


    app.listen(PORT , ()=>{
        console.log("server listening on port " , PORT)
    })