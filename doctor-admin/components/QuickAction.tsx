"use client"
import React from "react";
import styles from "@/styles/QuickActions.module.css"
import Image from "next/image";
import { useRouter } from "next/navigation";

const QuickActions = ()=>{
    const router = useRouter()

    return(
        <div className={styles.quickDiv}>
            <div className={styles.appStat}>
                <div>Quick Actions</div>
                {/* <div>{appointments?.length}</div> */}
                <hr />
            </div>


            <div className={styles.quickNavs}>
                <div className={styles.createDoc} onClick={()=>{router.push("/createDoc")}}>
                    
                    <div className={styles.iconContainer}>
                        <Image src={"/health.png"} alt="" fill />
                    </div>

                    <div className={styles.text}>
                        Add Doctor
                    </div>
                </div>

                <div className={styles.manageApp} onClick={()=>{router.push("/appointments")}}>
                    
                    <div className={styles.iconContainer}>
                        <Image src={"/circle.png"} alt="" fill />
                    </div>

                    <div className={styles.manageText}>
                        Manage Appointments
                    </div>
                </div>
            </div>


        </div>
    )
}

export default QuickActions