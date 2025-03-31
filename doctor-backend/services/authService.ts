import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'


const authService = {
    register: async (name:string, email:string, password:string, role:string) => {
        try {
            const user =await userModel.findUserByEmail(email);
            if (user) {
                return {success : false , data :"user already exists"}
            }

            const salt = await bcrypt.genSalt(10)
            const encryptPass = await bcrypt.hash(password, salt);

            const newUser = await userModel.createUser(email, encryptPass, name, role)
            return {success : true , data :newUser}
        } catch (error:any) {
            console.log("error : authService > register" , error.message)
            return {success : false , data :error.message}
        }
    },

    login: async (email:string, password:string) => {
        try {
            const user = await userModel.findUserByEmail(email)
            if (!user) {
                throw new Error("invalid credentials")
            }

            const isCorrectPass = await bcrypt.compare(password, user.password)
            if (!isCorrectPass) {
                throw new Error("Incorrect password")
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'jwt-secret', { expiresIn: '1d' })

            return { success:true ,data :{token, user} }
        } catch (error:any) {
            console.log("error : authService > login ", error.message)
            return {success : false , data :error.message}
        }

    },

    loginAsAdmin: async (email:string, password:string) => {
        try {
            const user = await userModel.findUserByEmail(email)
            if (!user) {
                throw new Error("invalid credentials")
            }

            const isCorrectPass = await bcrypt.compare(password, user.password)
            if (!isCorrectPass) {
                throw new Error("Incorrect password")
            }

            if(user.role !== "admin"){
                return {success:false , data:"Not an admin"}
            }

            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'jwt-secret', { expiresIn: '1d' })

            return { success:true ,data :{token, user} }
        } catch (error:any) {
            console.log("error : authService > loginAsAdmin ", error.message)
            return {success : false , data :error.message}
        }

    },

    requestPasswordReset : async(email:string)=>{
        try {
            const user = await userModel.findUserByEmail(email)
            if (!user) {
                throw new Error("invalid credentials")
            }

            const token = jwt.sign({email} , process.env.JWT_SECRET || "jwt-secret" ,{ expiresIn: '10m' } )
            const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

            const resetdata = await userModel.updateResetToken(email , token , expiryTime)

            const resetLink = `${process.env.Frontend_Base_URL}/resetPass/${token}`;

            return {success:true , data :resetdata , resetLink}

        } catch (error:any) {
            console.log("error: authservice > request reset")
            return {success:false , data :error.message}
        }
    },

    resetPassword : async(token:string , password:string)=>{
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET || "jwt-secret")
            let email;

            if(typeof decoded === 'object' && "email" in decoded){
                email = decoded.email;
            }
            else{
                throw new Error("invalid token payload")
            }
            
            if(!email){
                throw new Error("email not getted from decoded payload")
            }

            const response = await userModel.isValidToken(email,token)

            if(response.rows.length == 0){
                return {success:false , data:"invalid or expired token"}
            }

            const expiryTime = new Date(response.rows[0].reset_password_expires)
            
            if(expiryTime < new Date()){
                return {success:false , data:"token expires"}
            }


            const salt = await bcrypt.genSalt(10)
            const encryptPass = await bcrypt.hash(password, salt);

            const responseResetPassword = await userModel.updateResetPassword(email , encryptPass)

            return {success:true , data:responseResetPassword}

        } catch (error:any) {
            console.log("error: authservice > resetPassword")
            return {success:false , data:error.message}
        }
    },

    verifyToken : async(token:string)=>{
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET || "jwt-secret")

            return {success:true , data:decoded}
        } catch (error:any) {
            console.log("error : verifyToken > service")
            return {success:false , data:error.message}
        }
    }
}

export default authService