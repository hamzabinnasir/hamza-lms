import "./createCourse.css"
import React, { useContext, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import LMScontext from "../../context/LMScontext"
import { useNavigate } from "react-router-dom"

export default function CreateCourse() {
    const { backendURL, token } = useContext(LMScontext);
    const [category, setCategory] = useState("");
    const [courseTitle, setCourseTitle] = useState("");
    const navigate = useNavigate();

    const createCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendURL + "/api/course/create", { courseTitle, category }, { headers: { token: token } });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/admin/courses");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    return (
        <div className="createCoursePage">
            <div className="createCourseHeader">
                <h1>Create New Course</h1>
                <p>Add basic details for your new course</p>
            </div>

            <form onSubmit={createCourse} className="createCourseForm">
                <div className="formGroup">
                    <label>Title</label>
                    <input onChange={(e) => setCourseTitle(e.target.value)} type="text" placeholder="e.g. Fullstack Development" />
                </div>
                <div className="formGroup">
                    <label>Category</label>
                    <select onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="Next js">Next js</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Frontend Development">Frontend Development</option>
                        <option value="Fullstack Development">Fullstack Development</option>
                        <option value="MERN Stack Development">MERN Stack Development</option>
                        <option value="Backend Development">Backend Development</option>
                        <option value="Javascript">Javascript</option>
                        <option value="Python">Python</option>
                        <option value="Docker">Docker</option>
                        <option value="MongoDB">MongoDB</option>
                    </select>
                </div>
                <div className="formActions">
                    <button type="button" onClick={() => navigate("/admin/courses")} className="btnType2">Cancel</button>
                    <button type="submit" className="btnType1">Create Course</button>
                </div>
            </form>
        </div>
    )
}