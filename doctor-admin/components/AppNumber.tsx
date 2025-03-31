"use client"
import React from "react";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/AppNumber.module.css"

interface Appointments {
    doctor_name:string;
    appointment_type:string;
    newdate:string;
    start_time:string;
    end_time:string;
    patient_name:string;
    appointment_status:string;
    appointment_id:number
  }

interface DocNumberParams{
    loading : boolean
    appointments : Appointments[]
}

const AppNumber = ({appointments} : DocNumberParams) => {
    const router = useRouter()
    console.log("appointments : " , appointments)


    return (
        
        <div className={styles.docNumCard} onClick={()=>{router.push("/appointments")}}>
            <div className={styles.docIconWrapper}>
                <div className={styles.docIcon}>
                    <Image src={"/clock.svg"} alt="" fill />
                </div>
            </div>

            <div className={styles.docDetails}>
                <div className={styles.totDoc}>
                    Total Appointments
                </div>
                <div className={styles.docLength}>
                    {appointments.length}
                </div>
            </div>
        </div>
    )
}

export default AppNumber