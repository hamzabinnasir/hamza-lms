import "./login.css"
import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LMScontext from "../../context/LMScontext"
import axios from "axios"
import { toast } from "react-toastify"
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
    const { backendURL, setToken, token, login, setLogin, user } = useContext(LMScontext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("hamza@gmail.com");
    const [password, setPassword] = useState("hamza1234");

    const navigate = useNavigate();
    // Register user
    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendURL + "/api/user/register", { name, email, password });
            if (response.data.success) {
                toast.success(response.data.message);
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendURL + "/api/user/login", { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    useEffect(() => {
        if (token && user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [token, user, navigate]);

    return (
        <div className="loginPage">
            <div className="loginPageContainer">
                <div className="loginHeader">
                    <h1>Welcome Back</h1>
                    <p>{login === "login" ? "Login to access your account" : "Create an account to get started"}</p>
                </div>

                <div className="loginBtnContainer">
                    <button onClick={() => setLogin("login")} className={`tabBtn ${login === "login" ? "active" : ""}`}>Login</button>
                    <button onClick={() => setLogin("signUp")} className={`tabBtn ${login === "signUp" ? "active" : ""}`}>Sign Up</button>
                </div>

                {
                    login === "login" ?
                        <form onSubmit={loginUser} className="loginForm">
                            <div className="formGroup">
                                <label>Email</label>
                                <div className="inputWrapper">
                                    <EmailIcon className="inputIcon" />
                                    <input onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email" placeholder="name@example.com" required />
                                </div>
                            </div>
                            <div className="formGroup">
                                <label>Password</label>
                                <div className="inputWrapper">
                                    <LockIcon className="inputIcon" />
                                    <input onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password" placeholder="Enter your password" required />
                                </div>
                            </div>

                            <button type="submit" className="btnType1 fullWidth">Login</button>
                        </form >
                        :
                        <form onSubmit={registerUser} className="loginForm">
                            <div className="formGroup">
                                <label>Full Name</label>
                                <div className="inputWrapper">
                                    <PersonIcon className="inputIcon" />
                                    <input onChange={(e) => setName(e.target.value)} type="text" placeholder="John Doe" required />
                                </div>
                            </div>
                            <div className="formGroup">
                                <label>Email</label>
                                <div className="inputWrapper">
                                    <EmailIcon className="inputIcon" />
                                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@example.com" required />
                                </div>
                            </div>
                            <div className="formGroup">
                                <label>Password</label>
                                <div className="inputWrapper">
                                    <LockIcon className="inputIcon" />
                                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Create a password" required />
                                </div>
                            </div>

                            <button type="submit" className="btnType1 fullWidth">Sign Up</button>
                        </form>
                }
            </div>
        </div>
    )
}