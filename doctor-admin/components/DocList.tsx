import DocCard from "./DocCard"
import styles from "@/styles/DocList.module.css"
import React from "react"
import { DoctorBackend } from "@/data/doctors.types"

interface DocListParams{
    // onDocClick: (docId:number)=>void
    doc:DoctorBackend[]
}
const DocList = ({  doc} : DocListParams) => {
    return (
        <div className={styles.docListDiv}>
            {
                // doc?.length > 0 ? (
                    <>
                        {
                            doc.map(doctor => (
                                <DocCard
                                key={doctor.id}
                                doc = {doctor}
                                // onClick = {onDocClick}
                                ></DocCard>
                            ))
                        }
                    </>

                // ):null
            }
        </div>
    )
}

export default DocList