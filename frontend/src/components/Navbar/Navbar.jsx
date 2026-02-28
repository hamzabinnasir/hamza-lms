import "./navbar.css"
import React, { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import LMScontext from "../../context/LMScontext"
import { ThemeContext } from "../../context/ThemeContext"
import { assets } from "../../assets/assets"
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Navbar() {
    const [nav, setNav] = useState(false);
    const navigate = useNavigate();
    const { token, setLogin, setToken, user } = useContext(LMScontext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLoginPage = (param) => {
        if (param === "login") {
            setLogin("login");
        } else {
            setLogin("signup");
        }
        navigate("/login");
    }

    const logout = () => {
        navigate("/login");
        localStorage.removeItem("token");
        setToken("");
    }

    return (
        <>
            <nav id="navbar">
                <Link className="link" to={"/"}>
                    <h3>E-Learning</h3>
                </Link>

                <div className="navProfileContainer">
                    <div className="themeToggle" onClick={toggleTheme}>
                        {theme === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                    </div>
                    {
                        token ?
                            <img className="helloImgProfile" src={user?.photoUrl ? user.photoUrl : assets.profile_icon} alt="no img" onClick={() => setNav(!nav)} />
                            :
                            <div className="accountBtnContainer">
                                <button onClick={() => handleLoginPage("login")} className="btnType2">Log in</button>
                                <button onClick={() => handleLoginPage("signup")} className="btnType1">Sign up</button>
                            </div>
                    }
                </div>
                {
                    nav ?
                        <ul className="navListContainer">
                            <h3>My Account</h3>
                            <div className="navListsBox">
                                <Link className="link" to={"/my-learning"}>
                                    <li>My Learning</li>
                                </Link>
                                <Link className="link" to={"/profile"}>
                                    <li>Edit Profile</li>
                                </Link>
                                <li onClick={logout}>
                                    <p>Log out</p>
                                    <LogoutIcon />
                                </li>
                            </div>
                            {
                                user?.role === "admin" && (
                                    <div className="dashboardBtnDiv">
                                        <button onClick={() => navigate("/admin/dashboard")} id="dashboardBtn">Dashboard</button>
                                    </div>
                                )
                            }
                        </ul>
                        :
                        ""
                }
            </nav>
        </>
    )
}