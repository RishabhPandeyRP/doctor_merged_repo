"use client"

import { createContext , useContext, useState, ReactNode, useEffect } from "react"
import Cookies from "js-cookie"

interface AuthContextInterface{
    username : string | null;
    login : (username:string , token:string , userid:string)=>void;
    logout: ()=>void;
    token:string | null;
    userId:string | null
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthProvider = ({children} : {children : ReactNode})=>{
    const [username , setUsername] = useState<string | null>(Cookies.get("username") || null)
    const [token , setToken] = useState<string | null>(Cookies.get("token") || null);
    const [userId , setUserId] = useState<string | null>(Cookies.get("userid") || null);

    useEffect(()=>{
        const cookieToken = Cookies.get("token")
        const cookieUsername = Cookies.get("username")
        const cookieUserId = Cookies.get("userid")

        if(cookieToken && cookieUsername && cookieUserId){
            setToken(cookieToken)
            setUsername(cookieUsername)
            setUserId(cookieUserId)
        }
        else{
            setToken(null)
            setUsername(null)
            setUserId(null)
        }
    },[])
    
    const login = (token:string , username:string , userid:string)=>{
        Cookies.set("token" , token , {expires:1,secure: true,
            sameSite: 'strict'})
        Cookies.set("username" , username , {expires:1,secure: true,
            sameSite: 'strict'})
        Cookies.set("userid" , userid , {expires:1,secure: true,
            sameSite: 'strict'})
        setUsername(username)
        setToken(token)
        setUserId(userid)
    }

    const logout = ()=>{
        Cookies.remove("token")
        Cookies.remove("username")
        Cookies.remove("userid")
        setUsername(null)
        setToken(null)
        setUserId(null)
    }
    return(
        <AuthContext.Provider value={{username, token, userId , login ,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = ()=>{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("UseAuth error")
    }
    return context
}