"use client"

import { createContext , useContext, useState, ReactNode, useEffect } from "react"
import Cookies from "js-cookie"

interface AuthContextInterface{
    username : string | null;
    login : (username:string , token:string )=>void;
    logout: ()=>void;
    token:string | null;
    // userId:string | null
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const AuthProvider = ({children} : {children : ReactNode})=>{
    const [username , setUsername] = useState<string | null>(Cookies.get("admin-username") || null)
    const [token , setToken] = useState<string | null>(Cookies.get("admin-token") || null);
    // const [userId , setUserId] = useState<string | null>(Cookies.get("userid") || null);

    useEffect(()=>{
        const cookieToken = Cookies.get("admin-token")
        const cookieUsername = Cookies.get("admin-username")
        // const cookieUserId = Cookies.get("userid")

        if(cookieToken && cookieUsername){
            setToken(cookieToken)
            setUsername(cookieUsername)
            // setUserId(cookieUserId)
        }
        else{
            setToken(null)
            setUsername(null)
            // setUserId(null)
        }
    },[])
    
    const login = (token:string , username:string)=>{
        Cookies.set("admin-token" , token , {expires:1,secure: true,
            sameSite: 'strict'})
        Cookies.set("admin-username" , username , {expires:1,secure: true,
            sameSite: 'strict'})
        // Cookies.set("userid" , userid , {expires:1,secure: true,
        //     sameSite: 'strict'})
        setUsername(username)
        setToken(token)
        // setUserId(userid)
    }

    const logout = ()=>{
        Cookies.remove("admin-token")
        Cookies.remove("admin-username")
        // Cookies.remove("userid")
        setUsername(null)
        setToken(null)
        // setUserId(null)
    }
    return(
        <AuthContext.Provider value={{username, token , login ,logout}}>
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