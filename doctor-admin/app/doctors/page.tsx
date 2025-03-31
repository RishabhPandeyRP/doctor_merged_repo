"use client"
import DocList from "@/components/DocList"
import Loader from "@/components/Loader"
import styles from "@/styles/Doctors.module.css"
import axios from "axios"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { useCallback } from "react"

const Doctors = () => {
    const [loading, setLoading] = useState(false)
    const [doctors, setDoctors] = useState([])
    const [currPage, setCurrPage] = useState(1)
    const token = Cookies.get("admin-token")
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;


    const fetcher = useCallback(async () => {
        try {
            setLoading(true)

            const response = await axios.get(`${API_BASE_URL}/doctors/page-doctors?page=${currPage}&limit=6`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("doctors from fetcher : ", response.data?.docname)
            setDoctors(Array.isArray(response.data?.docname.doctors) ? response.data?.docname.doctors : [])
            setLoading(false)

        } catch (error: unknown) {

            if (error instanceof Error) {
                console.log("error at doctor fetching", error.message)

            } else {
                console.log("Unknown error occurred during doctor fetching");
            }
            setDoctors([])
            setLoading(false)
        }
    }, [currPage, token])

    const pageChangehandler = (page_direction: number) => {
        setCurrPage(currPage + page_direction)
    }

    useEffect(() => {

        if (!token) return

        if (token) {
            fetcher()
        }
    }, [token, fetcher])

    return (
        <div className={styles.docDiv}>
            {/* <div className={styles.docStat}>
                <div>
                Doctor's Count
                </div>

                <div>
                    {doctors?.length}
                </div>
                
            </div> */}

            <div className={styles.docContainer}>
                {
                    loading ?
                        <div className={styles.loader}><Loader></Loader></div> :
                        <div>
                            <DocList doc={doctors}></DocList>

                            <div className={styles.pagination}>
                                <button className={styles.pageBtn} onClick={() => pageChangehandler(-1)} disabled={currPage == 1}>prev</button>
                                <div className={styles.pageBtnValue}>{currPage}</div>
                                <button className={styles.pageBtn} onClick={() => pageChangehandler(1)}>next</button>
                            </div>
                        </div>
                }
            </div>



        </div>
    )
}

export default Doctors