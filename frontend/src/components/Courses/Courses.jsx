import "./courses.css"
import React, { useState, useContext, useEffect, useCallback } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Course from "../Course/Course"
import LMScontext from "../../context/LMScontext"

export default function Courses() {
    const { backendURL } = useContext(LMScontext);
    const [publishedCourses, setPublishedCourses] = useState([]);
    const getPublishedCourses = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + "/api/course/publishedCourses");
            if (response.data.success) {
                setPublishedCourses(response.data.publishedCourses);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendURL]);

    useEffect(() => {
        getPublishedCourses();
    }, [getPublishedCourses]);
    return (
        <div className="CoursesPage">
            <div className="coursesHeader">
                <h1>Our Featured Courses</h1>
                <p>Explore top-rated courses to boost your skills</p>
            </div>
            <div className="userCoursesContainer">
                {
                    publishedCourses && publishedCourses?.length > 0 ?
                        publishedCourses.map((course, index) =>
                            <Course key={index} course={course} />
                        )
                        :
                        <div className="noCoursesFound">
                            <p>No courses available at the moment.</p>
                        </div>
                }
            </div>
        </div>
    )
}