"use client"
import React from "react";
import styles from "@/styles/RecentApp.module.css"


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

interface RecentApp{
    appointments : Appointments[]
}
const RecentApp = ({appointments} : RecentApp)=>{
    console.log("recent appointments" , appointments)
    return(
        <div className={styles.recentDiv}>
            <div className={styles.appStat}>
                <div>Recent Appointments</div>
                {/* <div>{appointments?.length}</div> */}
                <hr />
            </div>

            <div className={styles.recentApp}>
                {
                    appointments.map((item , index)=>(
                        <div key={index} className={styles.appDiv}>
                            <div className={styles.names}>
                                <div className={styles.patientname}>
                                    {item.patient_name}
                                </div>
                                <div className={styles.doctorname}>
                                    Dr. {item.doctor_name}
                                </div>
                            </div>

                            <div className={styles.date}>
                            {item.newdate.split("T")[0]}
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default RecentApp