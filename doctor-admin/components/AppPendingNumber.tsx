"use client"
import React from "react";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/AppPendingNumber.module.css"


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

const AppPendingNumber = ({appointments } : DocNumberParams) => {
    

    const pendingNumber = appointments.filter(item => item.appointment_status == 'pending').length
    const router = useRouter()

    return (
        <div className={styles.docNumCard} onClick={()=>{router.push("/appointments")}}>
            <div className={styles.docIconWrapper}>
                <div className={styles.docIcon}>
                    <Image src={"/clock.svg"} alt="" fill />
                </div>
            </div>

            <div className={styles.docDetails}>
                <div className={styles.totDoc}>
                    Pending Appointments
                </div>
                <div className={styles.docLength}>
                    {pendingNumber}
                </div>
            </div>
        </div>
    )
}

export default AppPendingNumber