"use client";
import "./login.css";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
    const { token } = useParams();
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const toggleShowPass = () => {
        setShowPass(prevState => !prevState);
    };
    const toggleShowConfirmPass = () => {
        setShowConfirmPass(prevState => !prevState);
    };

    const resetHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
                token,
                password: formData.password,
            });

            if (response.status == 200) {
                toast.success(response.data.message);
                setTimeout(() => router.push("/login"), 3000);
            }



        } catch (error: unknown) {

            if (error instanceof Error) {
                console.error("Reset password error:", error.message);
                toast.error(error.message || "Error resetting password");

            } else {
                console.log("Unknown error occurred while pagination");
                toast.error("Unknown error occurred");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-div">
            <div className="login-content">
                <h2 className="login-heading">Reset Password</h2>

                <form className="login-form">
                    <label htmlFor="password" className="muted-text">Password</label>
                    {/* <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={changeHandler}
                        id="password"
                        className="inputs"
                        required
                    /> */}

                    <div className="input-container">

                        <input
                            type={showPass ? "text" : "password"} 
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={changeHandler}
                            id="password"
                            className="inputs"
                            required />

                        <span className="password-toggle" onClick={toggleShowPass}>
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <label htmlFor="confirm_password" className="muted-text">Confirm Password</label>
                    {/* <div className="input-container">
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Enter your password again"
                            value={formData.confirm_password}
                            onChange={changeHandler}
                            id="confirm_password"
                            className="inputs"
                            required
                        />
                    </div> */}

                    <div className="input-container">

                        <input
                            type={showConfirmPass ? "text" : "password"} name="confirm_password"
                            placeholder="Enter your password again"
                            value={formData.confirm_password}
                            onChange={changeHandler}
                            id="confirm_password"
                            className="inputs"
                            required />

                        <span className="password-toggle" onClick={toggleShowConfirmPass}>
                            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button className="buttons" id="rst-btn" onClick={resetHandler} disabled={loading}>
                        {loading ? "Resetting..." : "Reset"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
