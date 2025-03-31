"use client"
import { useState } from "react"
import "./signup.css"
import toast from "react-hot-toast"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaEye, FaEyeSlash } from "react-icons/fa";


const SignUp = () => {
    const [formData , setFormData] = useState({
        name : "",
        email : "",
        password : ""
    })
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
    const [loading , setLoading] = useState(false)
    const [message , setMessage] = useState("")
    const router = useRouter()
    const [showPass, setShowPass] = useState(false);

    const toggleShowPass = () => {
        setShowPass(prevState => !prevState);
    };

    const changeHandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    const checkValidMail = (mail:string)=>{
        const provider = mail.split("@")[1].split(".")[0]
        if(provider == "gmail" || provider == "tothenew") return true
        return false
    }

    

    const submitHandler = async (e:React.FormEvent)=>{
        e.preventDefault()

        try {
            setLoading(true)
            setMessage("")

            if(!checkValidMail(formData.email)){
                toast.error("Only gmail and tothenew domains applicable")
                setLoading(false)
                return
            }

            console.log("this is form data" , formData)
            const response = await axios.post(`${API_BASE_URL}/auth/register` , formData , {headers:{"Content-Type":"application/json"}})
            setMessage(response.data.message)

            if(response.status == 200){
                if(response.data.message == "user already exists") {
                    toast.error(message)
                    setLoading(false)
                    return
                }
                toast.success("Successfully signed up")
                setLoading(false)
                router.push("/login")
                return
            }

            if (response.status == 500){
                
                toast.error("Error occured while signing up")
                setLoading(false)
                return
            }

            toast.error("Some error occured")
            setLoading(false)
        } catch (error:unknown) {
            
            

            if (error instanceof Error) {
                console.error("Error while signing up", error.message);
                toast.error("Error while signing up")
            
            } else {
                console.log("Error while signing up");
                toast.error("Unknown error occurred while signing up");
            }
            setLoading(false)
        }

        
    }

    const resetHandler = (e:React.FormEvent)=>{
        e.preventDefault()
        setFormData({name:"" , email:"" , password:""})
    }

    const handleGoogleLogin = (e:React.FormEvent) => {
        e.preventDefault()
        window.location.href = `${API_BASE_URL}/auth/google`; 
      };

    return (
        <div className="login-div">
            <div className="login-content">
                <h2 className="login-heading">Sign Up</h2>

                <div>
                    <span className="muted-text">Already a member?</span>
                    <Link href={"/login"} className="muted-text-2"><span>Login</span></Link>
                    
                </div>


                <form className="login-form">
                    <label htmlFor="name" className="muted-text">Name</label>
                    <div className="input-container">
                    <input type="text" name="name" placeholder="enter your name" value={formData.name} onChange={changeHandler} id="name" className="inputs" />
                    </div>

                    <label htmlFor="email" className="muted-text">Email</label>
                    <div className="input-container">
                    <input type="email" name="email" placeholder="enter your email" value={formData.email} onChange={changeHandler} id="email" className="inputs" />
                    </div>

                    <label htmlFor="password" className="muted-text">Password</label>
                    {/* <input type="password" name="password" placeholder="enter your password" value={formData.password} onChange={changeHandler} id="password" className="inputs" /> */}

                    <div className="input-container">
                        <input type={showPass ? "text" : "password"} name="password" placeholder="enter your password" value={formData.password} onChange={changeHandler} id="password" className="inputs" />
                        <span className="password-toggle" onClick={toggleShowPass}>
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>


                    <button className="buttons" id="login-btn" onClick={submitHandler} disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                    <button className="buttons"  onClick={handleGoogleLogin}>
                        Sign in with Google
                    </button>

                    <button className="buttons" id="rst-btn" onClick={resetHandler}>
                        Reset
                    </button>
                </form>

            </div>
        </div>
    )
}

export default SignUp