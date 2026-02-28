import "../App.css"
import React from "react"
import Navbar from "../components/Navbar/Navbar"
import Sidebar from "../components/Sidebar/Sidebar"
import Dashboard from "./Dashboard/Dasboard"
import AdminCourses from "./AdminCourses/AdminCourses"
import CreateCourse from "./CreateCourse/CreateCourse"
import EditCourse from "./EditCourse/EditCourse"
import LecturesPage from "./LecturesPage/LecturesPage"
import EditLecture from "./EditLecture/EditLecture"
import { Routes, Route } from "react-router-dom"
export default function Admin() {
    return (
        <>
            <Navbar />
            <div className="adminContainer">
                <Sidebar />
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courses" element={<AdminCourses />} />
                    <Route path="/course/create" element={<CreateCourse />} />
                    <Route path="/course/:courseId" element={<EditCourse />} />
                    <Route path="/course/:courseId/lecture" element={<LecturesPage/>}/>
                    <Route path="/course/:courseId/lecture/:lectureId" element={<EditLecture/>} />
                </Routes>
            </div>
        </>
    )
}