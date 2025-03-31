import { Request,Response,NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    user?: {id:number; role:string}
  }

  const adminMiddleware = (req:AuthenticatedRequest , res:Response , next:NextFunction)=>{
    if(!req.user || req.user.role !== 'admin'){
        return res.status(403).json({message:"Forbidden access control : only for admin"})
    }
    next()
  }

  export default adminMiddleware