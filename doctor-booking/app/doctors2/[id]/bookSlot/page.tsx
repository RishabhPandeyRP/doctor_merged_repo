import React from "react"
import styles from "@/styles/BookingSlot.module.css"
import doc_list from "@/data/doctors.json"
import SlotBooking from "@/components/SlotBooking"
import axios from "axios"
import { cookies } from "next/headers"

const Booking =  async({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    console.log("id from the booking page", id)
    const Cookie = await cookies()
    const token = Cookie.get("token")?.value;
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

    const response  = await axios.get(`${API_BASE_URL}/doctors/${id}`, {
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    console.log("response from profile is " , response.data.docname)

    return (
        <div className={styles.slotDiv}>
            <div className={styles.slotLeft}>
                <div className={styles.leftTitle}>
                    Book Your Next Doctor Visit in Seconds.
                </div>
                <div className={styles.leftDesc}>
                    CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need.
                </div>
            </div>

            <div className={styles.slotRight}>
                <SlotBooking doc_list={doc_list} id={id} location={response.data.docname.location}></SlotBooking>
            </div>
        </div>
    )
}

export default Booking