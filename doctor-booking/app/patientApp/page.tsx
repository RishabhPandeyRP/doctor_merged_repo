"use client"
import React, { useState, useEffect } from 'react';
import styles from '@/styles/PatientApp.module.css';
import Cookies from 'js-cookie';
import axios from 'axios';

interface Appointments{
    id:number;
    start_time:string;
    newdate:string;
    status:string;
    doctor_name:string;
    specialty:string;

}
const PatientApp = () => {
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  

  useEffect(() => {
    const id = Cookies.get("userid")
    if(!id){
        return
    }
    fetchAppointments(String(id));
  }, []);

  const fetchAppointments = async (id:string) => {
    setLoading(true);
    try {
      
    
      const response =await axios.get(`${API_BASE_URL}/appointment/patient/${id}`)

      if(response.status == 200){
        console.log("response from appointment fetching")
        setAppointments(response.data)
        setLoading(false)
        return
      }


    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };


  const renderAppointmentsList = () => {
    
    if (loading) {
      return <div className={styles.loading}>Loading appointments...</div>;
    }
    
    if (appointments.length === 0) {
      return <div className={styles.noAppointments}>No appointments found</div>;
    }
    
    return appointments.map(appointment => {
      const date = new Date(appointment.newdate);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return (
        <div key={appointment.id} className={styles.appointmentCard}>
          <div className={styles.appointmentDate}>Dr. {appointment.doctor_name}</div>
          <div className={styles.appointmentTime}>{formattedDate} at {appointment.start_time}</div>
          <div className={styles.appointmentDetails}>
            <div className={styles.appointmentLocation}>{appointment.specialty}</div>
            <div className={`${styles.appointmentStatus} ${styles[`status${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`]}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Your Appointments</h1>
        </div>
      
      <div className={styles.appointmentsContainer}>
        
        <div className={styles.appointmentsList}>
          {renderAppointmentsList()}
        </div>
      </div>
    </div>
  );
};

export default PatientApp;