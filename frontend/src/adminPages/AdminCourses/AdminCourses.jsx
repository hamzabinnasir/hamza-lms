import "./adminCourses.css"
import React, { useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import LMScontext from "../../context/LMScontext";
import { toast } from "react-toastify"
import axios from "axios"
import AddIcon from '@mui/icons-material/Add';

export default function AdminCourses() {
    const [allAdminCourses, setAllAdminCourses] = useState([]);
    const { backendURL, currency } = useContext(LMScontext);
    const navigate = useNavigate();

    const getCreatorCourses = useCallback(async (token) => {
        try {
            const response = await axios.get(backendURL + "/api/course/all", { headers: { token: token } });
            if (response.data.success) {
                setAllAdminCourses(response.data.creatorCourses);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendURL]);

    useEffect(() => {
        getCreatorCourses(localStorage.getItem("token"));
    }, [getCreatorCourses]);

    return (
        <div className="coursesPage">
            <div className="coursesPageHeader">
                <h1>All Courses</h1>
                <button onClick={() => navigate("/admin/course/create")} className="btnType1">
                    <AddIcon fontSize="small" /> Create New Course
                </button>
            </div>
            <div className="courseTableContainer">
                <div className="courseListHeader">
                    <p>Title</p>
                    <p>Price</p>
                    <p>Status</p>
                    <p>Action</p>
                </div>
                <div className="adminCourseList">
                    {
                        allAdminCourses && allAdminCourses.length > 0 ?
                            allAdminCourses.map((course, index) =>
                                <div className="courseRow" key={index}>
                                    <p className="courseTitle">{course.courseTitle}</p>
                                    <p className="coursePrice">{course.coursePrice ? `${currency}${course.coursePrice}` : 'NA'}</p>
                                    <div className="courseStatus">
                                        {
                                            course.isPublished ?
                                                <span className="statusBadge published">Published</span>
                                                :
                                                <span className="statusBadge draft">Draft</span>
                                        }
                                    </div>
                                    <button onClick={() => navigate(`/admin/course/${course._id}`)} className="btnType2">Edit</button>
                                </div>
                            )
                            :
                            <div className="noCourses">
                                <p>No courses found</p>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}