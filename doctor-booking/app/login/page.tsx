"use client"
import "./login.css"
import toast from "react-hot-toast"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AppContext"
import Link from "next/link"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
    const router = useRouter()
    const { login } = useAuthContext()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [isForgot, setIsForgot] = useState<boolean>(false)
    const [showPass, setShowPass] = useState(false);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const toggleShowPass = () => {
        setShowPass(prevState => !prevState);
    };

    const loginHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage("")
            console.log("this is form data", formData)
            const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, { headers: { "Content-Type": "application/json" } })
            setMessage(response.data.message)
            console.log(message)
            console.log("login response ", response.data)
            const { token, username, id } = response.data;

            login(token, username, String(id))


            if (response.status == 200) {


                setLoading(false)
                router.push("/")
                return
            }

            if (response.status == 500) {

                toast.error("Error while logged you in")
                setLoading(false)
                return
            }

            toast.error("Some error occured")
            setLoading(false)

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("Error during login:", error.message);
                toast.error("Error while logging in");
            } else {
                console.log("Unknown error occurred during login");
                toast.error("An unexpected error occurred");
            }
            setLoading(false)
        }


    }

    const forgotHandler = async (e: React.FormEvent) => {
        if (isForgot) return
        try {
            setIsForgot(true)
            e.preventDefault()
            const email = formData.email

            const response = await axios.post(`${API_BASE_URL}/auth/request-password-reset`, { email }, { headers: { "Content-Type": "application/json" } })

            if (response.status == 200) {
                toast.success("Resent mail sent , link is only valid for 10 minutes")
                setIsForgot(false)
                return
            }
            setIsForgot(false)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("Error during requesting reset password:", error.message);
                toast.error("Error while reset password");
            } else {
                console.log("Unknown error occurred during reset password");
                toast.error("An unexpected error occurred");
            }
            setIsForgot(false)
        }
    }

    const resetHandler = (e: React.FormEvent) => {
        e.preventDefault()
        setFormData({ email: "", password: "" })
    }

    return (
        <div className="login-div">
            <div className="login-content">
                <h2 className="login-heading">Login</h2>

                <div>
                    <span className="muted-text">Are you a new member?</span>
                    <Link href={"/signup"}><span className="muted-text-2">Sign up here.</span></Link>

                </div>


                <form className="login-form">
                    <label htmlFor="email" className="muted-text">Email</label>
                    <div className="input-container">
                    <input type="email" name="email" placeholder="enter your email" value={formData.email} onChange={changeHandler} id="email" className="inputs" />
                    </div>

                    <label htmlFor="password" className="muted-text">Password</label>
                    <div className="input-container">
                        <input type={showPass ? "text" : "password"} name="password" placeholder="enter your password" value={formData.password} onChange={changeHandler} id="password" className="inputs" />
                        <span className="password-toggle" onClick={toggleShowPass}>
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>


                    <button className="buttons" id="login-btn" onClick={loginHandler} disabled={loading}>
                        {loading ? "Logging you in..." : "Login"}
                    </button>

                    <button className="buttons" id="rst-btn" onClick={resetHandler}>
                        Reset
                    </button>
                </form>


                <div className="forgot-pass" onClick={forgotHandler}>
                    {isForgot ? "please wait..." : "Forgot Password"}
                </div>
            </div>
        </div>
    )
}

export default Login