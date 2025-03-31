import { Request, Response } from "express";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const mailController = {
    sendMail : async(req:Request , res:Response)=>{
        try {
            const {toMail , subject , text} = req.body;

            let testAccount = await nodemailer.createTestAccount()

            let transporter = await nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                // service: 'Gmail',
                auth: {
                    user: process.env.NODEMAIL_EMAIL,
                    pass: process.env.NODEMAIL_PASS
                }
            })

            let info  = await transporter.sendMail({
                from: '"MedCare" <medcare@gmail.email>', 
                to: toMail, 
                subject: subject,
                text: text,
              })

            console.log("sent mail" , info.messageId)
            res.status(200).json({message:"mail sent" , data:info})
        } catch (error:any) {
            console.log("Error while sending mail ", error.message)
            res.status(500).json({message : error.message || "error while sending mail"})
        }
    }
}

export default mailController