import "./App.css"
import React from "react"
import Login from "./pages/Login/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Home from "./pages/Home/Home"
import SingleCourse from "./pages/SingleCourse/SingleCourse"
import Protected from "./pages/Protected/Protected"
import EditProfile from "./pages/EditProfile/EditProfile"
import CourseLectures from "./pages/Courselectures/CourseLectures"
import SearchPage from "./pages/SearchPage/SearchPage"
import MyLearning from "./pages/MyLearning/MyLearning"
import { ThemeProvider } from "./context/ThemeContext"

// Admin Pages
import Admin from "./adminPages/Admin"
import "react-toastify/dist/ReactToastify.css";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <ToastContainer theme="colored" />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<EditProfile />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/my-learning" element={<MyLearning />} />
                    <Route path="/courseLectures/:courseId" element={<CourseLectures />} />
                    <Route element={<Protected />}>
                        <Route path="/admin/*" element={<Admin />} />
                        <Route path="/course/:courseId" element={<SingleCourse />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}