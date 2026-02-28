import "./courseLectures.css"
import React, { useContext, useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import axios from "axios"
import LMScontext from "../../context/LMScontext"
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import Navbar from "../../components/Navbar/Navbar"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function CourseLectures() {
    const { backendURL, token } = useContext(LMScontext);
    const { courseId } = useParams();
    const [courseLectures, setCourseLectures] = useState([]);
    const [courseLecture, setCourseLecture] = useState(null);
    const [lecIndex, setLecIndex] = useState(1);
    const [completedLectures, setCompletedLectures] = useState([]);
    const [progress, setProgress] = useState(0);

    const getCourselectures = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/lecture/courseLectures/${courseId}`)
            if (response.data.success) {
                setCourseLectures(response.data.data);
                if (response.data.data.length > 0) {
                    setCourseLecture(response.data.data[0]);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendURL, courseId]);

    const calculateProgress = useCallback((completedCount, totalCount) => {
        if (totalCount === 0) return;
        const percentage = Math.round((completedCount / totalCount) * 100);
        setProgress(percentage);
    }, []);

    const fetchProgress = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/progress/get`, {
                headers: { token },
                params: { courseId }
            });
            if (response.data.success) {
                const completed = response.data.progress.completedLectures;
                setCompletedLectures(completed);
                calculateProgress(completed.length, courseLectures.length);
            }
        } catch (error) {
            console.log(error);
        }
    }, [backendURL, token, courseId, courseLectures.length, calculateProgress]);

    useEffect(() => {
        if (courseLectures.length > 0) {
            fetchProgress();
        }
    }, [courseLectures.length, fetchProgress]);

    useEffect(() => {
        getCourselectures();
    }, [getCourselectures]);

    const handleLecture = async (lectureId, index) => {
        setLecIndex(index + 1);
        try {
            const response = await axios.get(`${backendURL}/api/lecture/single/${lectureId}`)
            if (response.data.success) {
                setCourseLecture(response.data.findedLecture);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const markAsCompleted = async () => {
        if (!courseLecture) return;
        try {
            const response = await axios.post(`${backendURL}/api/progress/update`,
                { courseId, lectureId: courseLecture._id },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                const updatedCompleted = response.data.progress.completedLectures;
                setCompletedLectures(updatedCompleted);
                calculateProgress(updatedCompleted.length, courseLectures.length);
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div className="courseLecturesPage">
            <Navbar />
            <div className="courseLecturesContainer">
                <div className="videoPlayerSection">
                    <div className="videoWrapper">
                        {courseLecture ? (
                            <video
                                key={courseLecture.videoUrl}
                                src={courseLecture.videoUrl}
                                controls
                                autoPlay={false}
                            />
                        ) : (
                            <div className="noVideoPlaceholder">
                                <p>Select a lecture to start watching</p>
                            </div>
                        )}
                    </div>
                    <div className="videoMeta">
                        <div className="videoTitle">
                            <h2>Lecture {lecIndex}: <span>{courseLecture?.lectureTitle}</span></h2>
                        </div>
                        <button
                            className={`btnType2 markCompleteBtn ${completedLectures.includes(courseLecture?._id) ? 'completed' : ''}`}
                            onClick={markAsCompleted}
                        >
                            <CheckCircleOutlineIcon fontSize="small" />
                            {completedLectures.includes(courseLecture?._id) ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>

                <div className="playlistSection">
                    <div className="playlistHeader">
                        <h3>Course Content</h3>
                        <div className="progressContainer">
                            <div className="progressBar">
                                <div className="progressFill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span>{progress}% Completed</span>
                        </div>
                    </div>
                    <ul className="playlistItems">
                        {
                            courseLectures?.map((lecture, index) =>
                                <li
                                    onClick={() => handleLecture(lecture._id, index)}
                                    key={index}
                                    className={`playlistItem ${lecIndex === index + 1 ? 'active' : ''}`}
                                >
                                    <div className="playlistItemLeft">
                                        <PlayCircleFilledWhiteOutlinedIcon className="playIcon" />
                                        <div className="playlistItemInfo">
                                            <span className="lectureNumber">Lecture {index + 1}</span>
                                            <p className="lectureTitle">{lecture.lectureTitle}</p>
                                        </div>
                                    </div>
                                    {completedLectures.includes(lecture._id) && (
                                        <CheckCircleOutlineIcon className="completedIcon" fontSize="small" />
                                    )}
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}