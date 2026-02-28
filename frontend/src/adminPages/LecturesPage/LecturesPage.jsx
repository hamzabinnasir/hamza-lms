import "./lecturesPage.css"
import React, { useContext, useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import LMScontext from "../../context/LMScontext"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

export default function LecturesPage() {
    const { backendURL } = useContext(LMScontext);
    const { courseId } = useParams();
    const [lectureTitle, setLectureTitle] = useState("");
    const [courseLectures, setCourseLectures] = useState([]);
    const navigate = useNavigate();

    const createLecture = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendURL}/api/lecture/create/${courseId}`, { lectureTitle });
            if (response.data.success) {
                toast.success(response.data.message);
                setCourseLectures(response.data.courseLectures);
                setLectureTitle(""); // Clear input after creation
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const getCourseLectures = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/lecture/courseLectures/${courseId}`);
            if (response.data.success) {
                setCourseLectures(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendURL, courseId]);

    useEffect(() => {
        getCourseLectures();
    }, [getCourseLectures]);
    return (
        <div className="lecturePage">
            <div className="lecturePageHead">
                <div className="headerLeft">
                    <button onClick={() => navigate(`/admin/course/${courseId}`)} className="backBtn">
                        <ArrowBackIcon />
                    </button>
                    <div>
                        <h1>Manage Lectures</h1>
                        <p>Add and manage lectures for this course</p>
                    </div>
                </div>
            </div>

            <div className="lecturesContainer">
                <div className="createLectureSection">
                    <h3>Add New Lecture</h3>
                    <form onSubmit={createLecture} className="lecturePageForm">
                        <div className="formGroup">
                            <label>Lecture Title</label>
                            <input onChange={(e) => setLectureTitle(e.target.value)} type="text" placeholder="Ex. Introduction to React" value={lectureTitle} />
                        </div>
                        <button type="submit" className="btnType1">
                            <AddIcon fontSize="small" /> Add Lecture
                        </button>
                    </form>
                </div>

                <div className="lecturesListSection">
                    <h3>Course Lectures</h3>
                    <div className="lecturesDiv">
                        {
                            courseLectures.length > 0 ?
                                courseLectures.map((lec, index) =>
                                    <div key={index} className="lectureRow">
                                        <div className="lectureInfo">
                                            <span className="lectureIndex">#{index + 1}</span>
                                            <p className="lectureTitle">{lec?.lectureTitle}</p>
                                        </div>
                                        <button onClick={() => navigate(`/admin/course/${courseId}/lecture/${lec?._id}`)} className="btnType2">Edit</button>
                                    </div>
                                )
                                :
                                <div className="noLectures">
                                    <p>No lectures available yet</p>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}