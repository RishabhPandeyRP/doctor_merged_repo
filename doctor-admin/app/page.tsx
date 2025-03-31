"use client"
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import DocNumber from "@/components/DocNumber";
import styles from "./page.module.css";
import AppNumber from "@/components/AppNumber";
import AppPendingNumber from "@/components/AppPendingNumber";
import RecentApp from "@/components/RecentApp";
import QuickActions from "@/components/QuickAction";
import { useCallback } from "react";
import Loader from "@/components/Loader";

interface DoctorBackend {
  id: number;
  doctor_name: string;
  specialty: string;
  experience: string;
  rating: number;
  gender: string;
  imageUrl: string;
  diseases: string[];
  photo_url: string
}

interface Appointments {
  doctor_name: string;
  appointment_type: string;
  newdate: string;
  start_time: string;
  end_time: string;
  patient_name: string;
  appointment_status: string;
  appointment_id: number
}

export default function Home() {
  // const [currPage, setCurrPage] = useState(1)
  const [doctors, setDoctors] = useState<DoctorBackend[]>([])
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState<Appointments[]>([])
  const token = Cookies.get("admin-token")
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  const router = useRouter()

  const fetcher = useCallback(async () => {
    try {
      setLoading(true)

      const response = await axios.get(`${API_BASE_URL}/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log("doctors from fetcher : ", response.data?.docname)
      setDoctors(Array.isArray(response.data?.docname) ? response.data?.docname : [])

      fetchApp()
      // setLoading(false)

    } catch (error: unknown) {

      if (error instanceof Error) {
        console.log("error at doctor fetching", error.message)

      } else {
        console.log("Unknown error occurred during doctor fetching");
      }
      setDoctors([])
      setLoading(false)
    }
  }, [token])

  const fetchApp = async () => {
    try {
      // setLoading(true)
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
        console.log("error at appointment fetching", error.message)
      } else {
        console.log("Unknown error occurred at appointment fetching");
      }

      setAppointments([])
      setLoading(false)
    }
  }





  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
    else {
      // setLoading(true)
      fetcher()
      // setLoading(false)
      // fetchApp()
    }
  }, [token, fetcher])

  return (
    <>{loading ? <div className={styles.loader}>
      <Loader></Loader>
      <div>Please wait while we fetching the data</div>
      </div> :
      <div className={styles.page}>
        <div className={styles.header}>
          <DocNumber doctors={doctors} loading={loading}></DocNumber>

          <AppPendingNumber appointments={appointments} loading={loading}></AppPendingNumber>

          <AppNumber appointments={appointments} loading={loading}></AppNumber>
        </div>

        <div className={styles.details}>
          <RecentApp appointments={appointments.slice(0, 4)}></RecentApp>

          <QuickActions></QuickActions>
        </div>

      </div>
    }
    </>
  );
}
