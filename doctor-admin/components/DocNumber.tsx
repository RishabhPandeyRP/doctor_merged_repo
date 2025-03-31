"use client"
import React from "react";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/DocNumber.module.css"



interface DoctorBackend {
    id: number;
    doctor_name: string;
    specialty: string;
    experience: string;
    rating: number;
    gender: string;
    imageUrl: string;
    diseases: string[];
    photo_url:string
  }

  interface DocNumberParams{
    loading : boolean
    doctors : DoctorBackend[]
}

const DocNumber = ({doctors} : DocNumberParams) => {
    const router = useRouter()
    



    return (
        <div className={styles.docNumCard} onClick={()=>{router.push("/doctors")}}>
            <div className={styles.docIconWrapper}>
                <div className={styles.docIcon}>
                    <Image src={"/stethoscope.svg"} alt="" fill />
                </div>
            </div>

            <div className={styles.docDetails}>
                <div className={styles.totDoc}>
                    Total Doctors
                </div>
                <div className={styles.docLength}>
                    {doctors.length}
                </div>
            </div>
        </div>
    )
}

export default DocNumber