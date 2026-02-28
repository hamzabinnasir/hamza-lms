import React, { useContext, useEffect, useState, useCallback } from 'react'
import "./myLearning.css"
import LMScontext from '../../context/LMScontext'
import axios from 'axios'
import Navbar from '../../components/Navbar/Navbar'
import { useNavigate } from 'react-router-dom'

const MyLearning = () => {
    const { backendURL, token } = useContext(LMScontext);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const navigate = useNavigate();

    const fetchEnrolledCourses = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + "/api/course/my-courses", { headers: { token } });
            if (response.data.success) {
                setEnrolledCourses(response.data.enrolledCourses);
            }
        } catch (error) {
            console.log(error);
        }
    }, [backendURL, token]);

    useEffect(() => {
        if (token) {
            fetchEnrolledCourses();
        }
    }, [token, fetchEnrolledCourses]);

    return (
        <>
            <Navbar />
            <div className="myLearningPage">
                <div className="myLearningContainer">
                    <div className="myLearningHeader">
                        <h1>My Learning</h1>
                        <p>Track your progress and continue learning</p>
                    </div>

                    {enrolledCourses.length > 0 ? (
                        <div className="enrolledCoursesGrid">
                            {enrolledCourses.map((course, index) => (
                                <div key={index} className="learningCard" onClick={() => navigate(`/courseLectures/${course._id}`)}>
                                    <div className="learningCardImage">
                                        <img src={course.courseThumbnail} alt={course.courseTitle} />
                                        <div className="learningBadge">In Progress</div>
                                    </div>
                                    <div className="learningCardContent">
                                        <h3>{course.courseTitle}</h3>
                                        <p className="instructorName">By {course.creator?.name || "Instructor"}</p>

                                        <div className="progressBarContainer">
                                            <div className="progressBar">
                                                <div className="progressFill" style={{ width: `${course.progress || 0}%` }}></div>
                                            </div>
                                            <span className="progressText">{course.progress || 0}% Complete</span>
                                        </div>

                                        <button className="continueBtn">Continue Learning</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="noLearning">
                            <h2>You haven't enrolled in any courses yet.</h2>
                            <button onClick={() => navigate('/search')} className="browseBtn">Browse Courses</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MyLearning
