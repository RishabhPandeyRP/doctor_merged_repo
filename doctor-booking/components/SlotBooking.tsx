"use client"
import { DoctorExtended } from "@/data/doctors.types"
import styles from "@/styles/SlotBooking.module.css"
import { useState, useEffect, useRef, useMemo } from "react"
import axios from "axios"
import { useAuthContext } from "@/context/AppContext"
import toast from "react-hot-toast"
import Loader from "./Loader"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface SlotBooking {
    doc_list: DoctorExtended[];
    id: string;
    location: string
}

interface DateInformation {
    day: string;
    date: number;
    month: string;
    completeDate: Date;
    stringFormat: string

}

interface SlotInfo {
    slotId: number;
    id: number;
    date: string;
    slot: string;
    is_booked: boolean;
    start_time: string;
    end_time: string;
    is_available: boolean;
    newdate: string
}

const SlotBooking = ({ id, location }: SlotBooking) => {
    const { token, userId } = useAuthContext()
    const [slotType, setSlotType] = useState('online')
    const [selDate, setSelDate] = useState<DateInformation | null>(null)
    const [selSlot, setSelSlot] = useState<SlotInfo | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [currentMonth, setCurrMonth] = useState<Date>(new Date())
    const [availSlots, setAvailSlots] = useState<SlotInfo[]>([])
    const datesWrapperRef = useRef<HTMLDivElement>(null)
    const [isFetchingSlots, setFetchingSlots] = useState<boolean>(false)
    const router = useRouter()
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

    const slotChangeHandler = () => {
        if (slotType === 'online') {
            setSlotType('offline')
            return
        }
        setSlotType('online')
    }

    const dateGenerate = () => {

        const today = new Date();
        today.setMonth(currentMonth.getMonth())
        const dateArr = [];

        let i = 0;

        while (i < 15) {
            const date = new Date(today);
            date.setDate(i + today.getDate());
            dateArr.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                completeDate: date,
                stringFormat: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            });
            i++;
        }

        return dateArr;
    };
    const dates = useMemo(() => dateGenerate(), [currentMonth])


    useEffect(() => {
        setSelDate(dates[0])
        dateSelecthandler(dates[0])

    }, [dates])



    const dateSelecthandler = async (date: DateInformation) => {
        console.log("date clicked", date)
        setSelDate(date)
        setSelSlot(null)
        try {
            setFetchingSlots(true)
            const response = await axios.get(`${API_BASE_URL}/slots/${id}/${date.stringFormat}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("date data from response ", response.data)
            setAvailSlots(response.data)
            setFetchingSlots(false)
        } catch (error: unknown) {

            if (error instanceof Error) {
                console.log("some error occured while fetching slots data", error.message)
            } else {
                console.log("Unknown Error occured while fetching slots data");

            }
            setFetchingSlots(false)
        }
    }


    const getAMPM = (time: string) => {
        const hour = parseInt(time?.split(":")[0], 10)
        return hour < 12 ? "AM" : "PM"
    }

    const displayMorningSlots = availSlots.filter(slot => getAMPM(slot.start_time) === "AM")
    const displayNoonSlots = availSlots.filter(slot => getAMPM(slot.start_time) === "PM")


    const morningActive = displayMorningSlots.filter(slot => slot.is_available).length;
    const noonActive = displayNoonSlots.filter(slot => slot.is_available).length;




    const slotSelecthandler = (slotId: number) => {
        const selectedSlotArr = availSlots.find(slot => slot.id === slotId)
        console.log()
        if (selSlot == null) {

            if (selectedSlotArr && selectedSlotArr.is_available) {

                const date = new Date(selectedSlotArr.newdate).toISOString().slice(0, 10)
                setSelSlot({ start_time: selectedSlotArr.start_time, slotId: selectedSlotArr.id, date: date, end_time: selectedSlotArr.end_time } as SlotInfo)

                const updatedSlots = availSlots.map(slot => (
                    slot.id === slotId ? { ...slot, is_available: false } : slot
                ))

                setAvailSlots(updatedSlots)
            }
        }
        else if (selectedSlotArr && selectedSlotArr.start_time == selSlot.start_time) {
            setSelSlot(null)

            const updatedSlots = availSlots.map(slot => (
                slot.id === slotId ? { ...slot, is_available: true } : slot
            ))

            setAvailSlots(updatedSlots)
        }
        else {
            alert("slot already selected")
        }

    }

    const bookingHandler = async () => {

        try {
            if (!selDate || !selSlot) {
                alert("plase sel date and slot")
                return
            }

            const payload = {
                "doctor_id": Number(id),
                "patient_id": Number(userId),
                "doctor_slot_id": Number(selSlot.slotId),
                "appointment_date": selSlot.date,
                "start_time": selSlot.start_time,
                "end_time": selSlot.end_time,
                "type": slotType,
                "patient_details": { "age": 25, "gender": "male", "problem": "Headache" }
            }

            setLoading(true)

            console.log("this is payload ", payload)

            const response = await axios.post(`${API_BASE_URL}/appointment/book`, payload, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } })

            console.log("response after booking is done ", response.data)

            if (response.status == 200) {
                toast.success("Appointment booked")

                const mailPayload = {
                    toMail: "rishabh17704@gmail.com",
                    subject: "Appointment Booked",
                    text: `Hey, Your slot is booked for ${selSlot.date} from ${selSlot.start_time} to ${selSlot.end_time}. Your slot type is ${slotType} at ${location}`
                }

                const mailResponse = await axios.post(`${API_BASE_URL}/api/mail`, mailPayload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })

                if (mailResponse.status == 200) {
                    toast.success("Mail sent to patient")
                }
                toast.success("Rate doctor in 5 sec")

                setTimeout(()=>{
                    router.push("/rating")
                } , 5 * 1000)
                
                setLoading(false)
                return
            }

           
            toast.error("Some error occured while booking slot")
            setLoading(false)
        } catch (error: unknown) {



            if (error instanceof Error) {
                console.log("error while booking the slot : ", error.message)
                toast.error("Some error occured while booking slot")

            } else {
                console.log("Unknown Error occured while booking the slot");
                toast.error("Some error occured while booking slot")
            }

            setLoading(false)
        }

    }


    const monthNavigate = (direction: number) => {
        const updateMonth = new Date(currentMonth)

        updateMonth.setMonth(updateMonth.getMonth() + direction)
        setCurrMonth(updateMonth)

        if (datesWrapperRef.current) {
            datesWrapperRef.current.scrollLeft = 0;
        }
    }

    console.log("available slots are : ", availSlots)

    return (
        <div className={styles.slotDiv}>
            <div className={styles.slotForm}>
                <div className={styles.slotHeader}>
                    <div className={styles.slotHeaderTitle}>
                        Schedule Appointment
                    </div>
                    
                </div>

                <div className={styles.slotTypeBox}>
                    <div className={slotType === 'online' ? styles.slotActive : styles.slotType} onClick={slotChangeHandler}>Book Video Consult</div>
                    <div className={slotType === 'offline' ? styles.slotActive : styles.slotType} onClick={slotChangeHandler}>Book Hospital Visit</div>
                </div>

                {slotType == 'offline' && <div className={styles.slotLocation}>
                    {location}
                </div>}

                <div className={styles.slotMonth}>
                    <div className={styles.slotLeft} onClick={() => monthNavigate(-1)}>
                        <Image src={"/left-chevron.png"} alt="" fill />
                    </div>

                    <div>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>

                    <div className={styles.slotLeft} onClick={() => monthNavigate(1)}>
                        <Image src={"/right-chevron.png"} alt="" fill />
                    </div>
                </div>

                <div className={styles.datesWrapper} ref={datesWrapperRef}>
                    {
                        dates.map((date, index) => (
                            <div key={index} onClick={() => dateSelecthandler(date)} className={`${styles.dateCard} ${selDate && selDate.date === date.date && selDate.month === date.month ? styles.active : ''}`}>
                                <div className={styles.day}>{date.day}</div>
                                <div className={styles.date}>{date.date}</div>
                                <div className={styles.month}>{date.month}</div>
                            </div>
                        ))
                    }
                </div>

                <div className={styles.slotCardSuperWrapper}>

                    <div className={styles.slotCardWrapper}>
                        <div className={styles.slotIconHeader}>
                            <div className={styles.slotIconWrapper}>
                                <div className={styles.morningImg}>
                                    <Image src={"/sun.svg"} alt="sun image" fill></Image>
                                </div>
                                <div className={styles.morning}>
                                    Morning
                                </div>
                            </div>
                            <div>
                                {`${morningActive} ${morningActive == 1 ? "Slot" : "Slots"}`}
                            </div>
                        </div>

                        {isFetchingSlots ? <div className={styles.Loader}>
                            <Loader></Loader>

                        </div> : <div className={styles.slotCardsBox}>
                            {
                                displayMorningSlots.length != 0 ? displayMorningSlots.map((slot, index) => (
                                    <div key={index} className={!slot.is_available ? styles.activeSlotCard : styles.slotCards}

                                        onClick={() => slotSelecthandler(slot.id)}
                                    >
                                        {slot.start_time}
                                    </div>
                                )) : <div>No slots available</div>
                            }

                        </div>}
                    </div>

                    <div className={styles.slotCardWrapper}>
                        <div className={styles.slotIconHeader}>
                            <div className={styles.slotIconWrapper}>
                                <div className={styles.morningImg}>
                                    <Image src={"/sunset.svg"} alt="sun image" fill></Image>
                                </div>
                                <div className={styles.noon}>
                                    Afternoon
                                </div>
                            </div>
                            <div>
                                {`${noonActive} ${noonActive == 1 ? "Slot" : "Slots"}`}
                            </div>
                        </div>

                        {isFetchingSlots ? <div className={styles.Loader}>
                            <Loader></Loader>

                        </div> : <div className={styles.slotCardsBox}>
                            {
                                displayNoonSlots.length != 0 ? displayNoonSlots.map((slot, index) => (
                                    <div key={index} className={!slot.is_available ? styles.activeSlotCard : styles.slotCards}

                                        onClick={() => slot.is_available && selSlot == null && slotSelecthandler(slot.id)}>
                                        {slot.start_time}
                                    </div>
                                )) : <div>No slots available</div>
                            }
                        </div>}


                    </div>
                </div>

                <button className={styles.bookBtn} onClick={bookingHandler} disabled={loading}>
                    {
                        loading ? 'Proccessing ...' : 'Book Appointment'
                    }
                </button>
            </div>
        </div>
    )
}

export default SlotBooking