import React, { useEffect, useState, useCallback } from "react"
import LMScontext from "../context/LMScontext"
import axios from "axios"

export default function LMScontextProvider({ children }) {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    const currency = "$";
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [login, setLogin] = useState("login");
    const [user, setUser] = useState(null);
    const [allCourses, setAllCourses] = useState([]);

    const getUserProfile = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + "/api/user/profile", { headers: { token } });
            if (response.data.success) {
                setUser(response.data.findedUser);
            }
        } catch (error) {
            console.log(error);
        }
    }, [backendURL, token]);

    const fetchAllCourses = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + "/api/course/publishedCourses");
            if (response.data.success) {
                setAllCourses(response.data.publishedCourses);
            }
        } catch (error) {
            console.log(error);
        }
    }, [backendURL]);

    useEffect(() => {
        fetchAllCourses();
    }, [fetchAllCourses]);

    useEffect(() => {
        if (!token && localStorage.getItem("token")) {
            setToken(localStorage.getItem("token"));
        }
        if (token) {
            getUserProfile();
        } else {
            setUser(null);
        }
    }, [token, getUserProfile]);

    const contextVal = {
        backendURL,
        currency,
        setToken,
        token,
        login,
        setLogin,
        user,
        setUser,
        allCourses
    }
    return (
        <LMScontext.Provider value={contextVal}>
            {children}
        </LMScontext.Provider>
    )
}