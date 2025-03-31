import authService from "../services/authService.js";
import { Request, Response } from "express"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
interface AuthResponse<T> {
    success: boolean;
    data: T;
}

interface UserData {
    name: string;
    email: string;
    role: string;
    id: number
}

const authController = {

    

    register: async (req: Request, res: Response) => {
        try {
            const { name, email, password, role } = req.body
            const domain = email.split("@")[1].split(".")[0]

            if (domain != "gmail" && domain != "tothenew"){
                return res.status(500).json({message : "Only gmail and tothenew domains are applicable"})
            }
            

            const response: AuthResponse<UserData | string> = await authService.register(name, email, password, role || 'patient')
            if (response.success) {
                return res.status(200).json({ message: "signed up successfully", username: (response.data as UserData).name, id: (response.data as UserData).id })
            }
            res.status(200).json({ message: response.data })
        } catch (error: any) {
            console.log("error : authcontroller > register", error.message)
            res.status(500).json({ message: error.message || "error in controller auth" })
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const response = await authService.login(email, password)

            if (response.success) {
                return res.status(200).json({ id: response.data.user.id, username: response.data.user.name, token: response.data.token })
            }
            res.status(500).json({ message: "logged in successfully", data: response.data })
        } catch (error: any) {
            console.log("error : authcontroller > login", error.message)
            res.status(500).json({ message: error.message || "error : authcontroller > login" })
        }
    },

    loginAsAdmin: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const response = await authService.loginAsAdmin(email, password)

            if (response.success) {
                return res.status(200).json({ username: response.data.user.name, token: response.data.token })
            }
            res.status(500).json({ message: "logged in successfully", data: response.data })
        } catch (error: any) {
            console.log("error : authcontroller > loginAsAdmin", error.message)
            res.status(500).json({ message: error.message || "error : authcontroller > loginAsAdmin" })
        }
    },

    requestPasswordReset: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const request = await authService.requestPasswordReset(email)

            if (request.success) {
                let transporter = await nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: process.env.NODEMAIL_EMAIL,
                        pass: process.env.NODEMAIL_PASS
                    }
                })

                const resetlink = request.resetLink

                let info = await transporter.sendMail({
                    from: '"MedCare" <medcare@gmail.email>',
                    to: email,
                    subject: "Reset password link",
                    text: resetlink,
                    html: `<p>Click <a href="${resetlink}">here</a> to reset your password. The link is valid for 15 minutes.</p>`,
                })

                console.log("sent mail", info.messageId)
                return res.status(200).json({ message: "reset mail sent", data: info })

            }

            res.status(500).json({ message: "Some error occured while requesting password reset" })


        } catch (error: any) {
            console.log("error : authcontroller > request reset", error.message)
            res.status(500).json({ message: error.message || "error : authcontroller > request reset" })
        }
    },

    resetPassword: async (req: Request, res: Response) => {
        try {
            const { token, password } = req.body
            const response = await authService.resetPassword(token, password)
            if (response.success) {
                return res.status(200).json({ "message": "password reset successfully" })
            }
            res.status(500).json({ message: response.data })
        } catch (error: any) {
            console.log("error: authcontroller > resetpassword")
            res.status(500).json({ message: error.message })
        }
    },

    verifyToken: async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const response = await authService.verifyToken(token)

            if (response.success) {
                return res.status(200).json({ message: "token verified", data: response.data })
            }
            res.status(500).json({ message: "some error occurred" })
        } catch (error: any) {
            console.log("error:authcontroller > verify token")
            res.status(500).json({ message: error.message })
        }
    },

    passportAuth: async(req:Request, res:Response)=>{
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Google authentication failed" });
              }
          
              const user = req.user as any;
              const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name:user.name }, process.env.JWT_SECRET || "jwt-secret", {
                expiresIn: "1d",
              });
          
              console.log("this is redirect url : " , `${process.env.Frontend_Base_URL}/auth/success?token=${token}`)
              res.redirect(`${process.env.Frontend_Base_URL}/auth/success?token=${token}`);
        } catch (error) {
            console.error("Google OAuth Error:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default authController