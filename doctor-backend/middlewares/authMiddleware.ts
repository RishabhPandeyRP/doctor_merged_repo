import jwt from "jsonwebtoken"
import { Request , Response , NextFunction } from "express";
import dotenv from "dotenv"
dotenv.config()

interface AuthenticatedRequest extends Request {
    user?: {id:number; role:string}
  }
  

const authMiddleware = {
    isAuthenticated : async(req:AuthenticatedRequest,res : Response,next : NextFunction)=>{
        try {
            let token = req.headers.authorization;
        token = token?.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"unauthorised"})
        }

        const tokenDecoded = jwt.verify(token , process.env.JWT_SECRET as string) as {id:number;role:string}
        req.user = tokenDecoded
        next()
        } catch (error) {
            res.status(401).json({message : "invalid token"})
        }

    }
}

export default authMiddleware