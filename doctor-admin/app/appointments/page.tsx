"use client"

import axios from "axios"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import styles from "@/styles/Appointment.module.css"
import toast from "react-hot-toast"
import Loader from "@/components/Loader"

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

const Appointments = () => {
    const [loading, setLoading] = useState(false)
    // const [loading, setLoading] = useState(false)
    const [appointments, setAppointments] = useState<Appointments[]>([])
    const token = Cookies.get("admin-token")
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;


    const fetchApp = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE_URL}/appointment/getAll`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("appointments : ", response.data)

            setAppointments(response.data)
            setLoading(false)
        } catch (error: unknown) {
            

            if (error instanceof Error) {
                console.log("error at doctor fetching", error.message)
            
            } else {
                console.log("Unknown error occurred during doctor fetching");
            }

            setAppointments([])
            setLoading(false)
        }
    }

    useEffect(() => {

        if (!token) return

        if (token) {
            fetchApp()
        }
    }, [token])

    const handleStatusChange = async(id:number , type:string)=>{
        try {
            setLoading(true)
            console.log("id from status " , id)
            const payload = {
                status : type
            }

            const response = await axios.put(`${API_BASE_URL}/appointment/${id}/status`,payload,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            })

            if(response.status == 200){
                toast.success("status approved")
                setLoading(false)
                fetchApp()
                return
            }
            setLoading(false)
            

        } catch (error:unknown) {
            

            if (error instanceof Error) {
                console.log("error while updating status" , error.message)
            
            
            } else {
                console.log("Unknown error occurred while updating status");
            }
            toast.error("error while updating the status")
            setLoading(false)
        }
    }

    console.log("appointments " , appointments)

    return (
        <div className={styles.appDiv}>
            <div className={styles.appStat}>
                <div>Appointment Requests</div>
                {/* <div>{appointments?.length}</div> */}
                <hr />
            </div>

            <div className={styles.tableWrapper}>
                {appointments?.length ? (
                    <table className={styles.appTable}>
                        <thead>
                            <tr>
                                <th>Doctor Name</th>
                                <th>Slot Type</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Patient Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((item, index) => (
                                <tr key={index}>
                                    <td>Dr. {item.doctor_name}</td>
                                    <td>{item.appointment_type}</td>
                                    <td>{item.newdate.split("T")[0]}</td>
                                    <td>{item.start_time}</td>
                                    <td>{item.end_time}</td>
                                    <td>{item.patient_name}</td>
                                    <td>
                                        <div className={`${styles.cardStatus} ${styles[item.appointment_status]}`}>
                                        {item.appointment_status}
                                        </div>
                                        
                                    </td>
                                    <td>
                                        <button className={`${styles.appButton} ${styles.approveBtn}`} onClick={() => handleStatusChange(item.appointment_id, 'approved')} disabled={loading}>
                                            Approve
                                        </button>
                                        <button className={`${styles.appButton} ${styles.declineBtn}`} onClick={() => handleStatusChange(item.appointment_id, 'declined')} disabled={loading}>
                                            Decline
                                        </button>
                                        <button className={`${styles.appButton} ${styles.completeBtn}`} onClick={() => handleStatusChange(item.appointment_id, 'completed')} disabled={loading}>
                                            Complete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.loader}>
                        <Loader></Loader>
                    </div>
                )}
            </div>
        </div>

    )
}

export default Appointments