"use client"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { notFound } from "next/navigation"
import styles from "@/styles/CreateDoc.module.css"


interface DoctorFormData {
    name: string;
    email: string;
    password: string;
    specialty: string;
    experience: string;
    location: string;
    gender: string;
    diseases: string[];
}

const CreateDoc = () => {
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormdata] = useState<DoctorFormData>({
        name: "",
        email: "",
        password: "",
        specialty: "",
        experience: "",
        location: "",
        gender: "",
        diseases: [],
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const token = Cookies.get("admin-token")
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;


    if (!token) {
        return notFound()
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormdata((prev) => ({
            ...prev,
            [name]: name === "diseases" ? value.split(",").map((d) => d.trim()) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        
    };

    const checkValidMail = (mail:string)=>{
        const provider = mail.split("@")[1].split(".")[0]
        if(provider == "gmail" || provider == "tothenew") return true
        return false
    }

    const handleRegister = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)
            console.log("payload from register doc", formData)

            if(!checkValidMail(formData.email)){
                toast.error("Only gmail and tothenew domains applicable")
                setLoading(false)
                return
            }


            const userPayload = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role:"doctor"
            }

            console.log("payload for register user", userPayload)

            const userResponse = await axios.post(`${API_BASE_URL}/auth/register`, userPayload, { headers: { "Content-Type": "application/json" } })

            if (userResponse.status == 200) {
                if (userResponse.data.message == "user already exists") {
                    toast.error("user already exists")
                    setLoading(false)
                    return
                }
                console.log(userResponse.data)
                // toast.success("user registered")
                // setLoading(false)

            }

            const userId = userResponse.data.id;
            let imageUrl = null

            if (image) {
                const formDataImage = new FormData();
                if (image) formDataImage.append("image", image);

                const imageRes = await axios.post(`${API_BASE_URL}/api/upload`, formDataImage, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });

                if (imageRes.status !== 200) {
                    // setIsEdit(false);
                    toast.error("error while updating the image")
                    // setLoading(false)

                }

                console.log("image of doctor" , imageRes)

                imageUrl = imageRes.data.url
            }

            const docPayload = {
                user_id: userId,
                specialty: formData.specialty,
                experience: formData.experience,
                photo_url: imageUrl,
                location: formData.location,
                gender: formData.gender,
                diseases: formData.diseases,
                rating: userId % 5
            }

            console.log("payload for register doc", docPayload)

            const docResponse = await axios.post(`${API_BASE_URL}/doctors/register`, docPayload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })

            if (docResponse.status == 200) {
                console.log(docResponse.data)
                toast.success("doc registered")

                const mailPayload = {
                    toMail: formData.email,
                    subject: "Doctor profile created on Medcare",
                    text: `Hey Doc, You are registered on MedCare with username as ${formData.name} and email as ${formData.email}`
                }

                const mailResponse = await axios.post(`${API_BASE_URL}/api/mail`, mailPayload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })

                if(mailResponse.status == 200){
                    toast.success("Mail sent to doctor")
                }

                setLoading(false)
                return
            }

        } catch (error: unknown) {
            

            if (error instanceof Error) {
                console.log("error while registering doc ", error.message)
            
            
            } else {
                console.log("Unknown error occurred while registering doc ");
            }
            toast.error("error while registering doc")
            setLoading(false)
        }
    }

    return (

        <div className={styles.docDiv}>
            <form className={styles.docForm}>
                <h1 className={styles.formTitle}>Doctor Registration</h1>
                <p className={styles.formSubtitle}>Add a new doctor to the MedCare network</p>
                
                <div className={styles.imageUpload}>
                    <div className={styles.imagePreview}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile preview" />
                        ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        )}
                    </div>
                    <label className={styles.uploadButton}>
                        Upload Photo
                        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                    </label>
                </div>
                
                <div className={styles.formGrid}>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            placeholder="Dr. John Doe" 
                            value={formData.name || ''} 
                            onChange={changeHandler} 
                            className={styles.inputBox} 
                        />
                    </div>
                    
                    <div className={styles.inputWrapper}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email"
                            placeholder="doctor@example.com" 
                            value={formData.email || ''} 
                            onChange={changeHandler} 
                            className={styles.input} 
                        />
                    </div>
                    
                    <div className={styles.inputWrapper}>
                        <label htmlFor="specialty" className={styles.label}>Specialty</label>
                        <input 
                            type="text" 
                            name="specialty" 
                            id="specialty"
                            placeholder="Cardiology, Neurology, etc." 
                            value={formData.specialty || ''} 
                            onChange={changeHandler} 
                            className={styles.input} 
                        />
                    </div>
                    
                    <div className={styles.inputWrapper}>
                        <label htmlFor="experience" className={styles.label}>Years of Experience</label>
                        <select 
                            name="experience" 
                            id="experience"
                            value={formData.experience || ''} 
                            onChange={changeHandler} 
                            className={styles.select}
                        >
                            <option value="">Select experience</option>
                            <option value="15+ years">15+ years</option>
                            <option value="10-15 years">10-15 years</option>
                            <option value="5-10 years">5-10 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="1-3 years">1-3 years</option>
                            <option value="0-1 years">0-1 years</option>
                        </select>
                    </div>
                    
                    <div className={styles.inputWrapper}>
                        <label htmlFor="location" className={styles.label}>Location</label>
                        <input 
                            type="text" 
                            name="location" 
                            id="location"
                            placeholder="City, Country" 
                            value={formData.location || ''} 
                            onChange={changeHandler} 
                            className={styles.input} 
                        />
                    </div>
                    
                    <div className={styles.inputWrapper}>
                        <label htmlFor="gender" className={styles.label}>Gender</label>
                        <select 
                            name="gender" 
                            id="gender"
                            value={formData.gender || ''} 
                            onChange={changeHandler} 
                            className={styles.select}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div className={styles.inputWrapper + ' ' + styles.fullWidth}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password"
                            placeholder="Create a secure password" 
                            value={formData.password || ''} 
                            onChange={changeHandler} 
                            className={styles.input} 
                        />
                    </div>
                    
                    <div className={styles.inputWrapper + ' ' + styles.fullWidth}>
                        <label htmlFor="diseases" className={styles.label}>Conditions & Treatments</label>
                        <input
                            type="text"
                            name="diseases"
                            id="diseases"
                            value={formData.diseases ? formData.diseases.join(", ") : ""}
                            onChange={changeHandler}
                            placeholder="Enter diseases separated by commas"
                            className={styles.input}
                        />
                    </div>
                </div>

                <button 
                    className={styles.registerButton} 
                    onClick={handleRegister} 
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register Doctor'}
                </button>
            </form>
        </div>
    )
}

export default CreateDoc