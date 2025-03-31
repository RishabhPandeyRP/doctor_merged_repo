"use client"
import styles from "@/styles/Login.module.css"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { useState } from "react"
import { useAuthContext } from "@/context/AppContext"

const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
    const { login } = useAuthContext()

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const loginHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage("")
            console.log("this is form data", formData)
            const response = await axios.post(`${API_BASE_URL}/auth/login-admin`, formData, { headers: { "Content-Type": "application/json" } })
            setMessage(response.data.message)
            console.log(message)
            console.log("login response ", response.data)
            const { token, username } = response.data;

            if (response.status == 200) {

                toast.success("Logged in")
                login(token, username)
                setLoading(false)
                router.push("/")
                return
            }

            if (response.status == 500) {

                toast.error("Error while log you in")
                setLoading(false)
                return
            }

            toast.error("Some error occured")
            setLoading(false)

        } catch (error: unknown) {

            if (error instanceof Error) {
                console.log("error :login", error.message)
            } else {
                console.log("Unknown error occurred at :login");
            }
            toast.error("Error while logging up")
            setLoading(false)
        }


    }
    return (
        <div className={styles.loginDiv}>


            <div className={styles.loginContentWrapper}>

                <div className={styles.loginTitle}>
                    Admin Login
                </div>

                <form className={styles.inputForm}>
                    <div className={styles.inputWrapper}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} placeholder="email" onChange={changeHandler} className={styles.emailInput} />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" value={formData.password} placeholder="password" onChange={changeHandler} className={styles.passInput} />
                    </div>

                    <button onClick={loginHandler} className={styles.loginBtn} disabled={loading}>
                        {loading ? "logging you in..." : "login"}
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Login