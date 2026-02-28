import "./singleCourse.css"
import React, { useContext, useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar"
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import LockIcon from '@mui/icons-material/Lock';
import axios from "axios"
import LMScontext from "../../context/LMScontext";

export default function SingleCourse() {
    const { courseId } = useParams();
    const [singleCourse, setSingleCourse] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [currentVideoPoster, setCurrentVideoPoster] = useState(null);
    const { backendURL, currency, user, token } = useContext(LMScontext);
    const navigate = useNavigate();

    const getSingleCourse = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/course/single/${courseId}`)
            if (response.data.success) {
                setSingleCourse(response.data.singleCourse);
                // Set initial video (first lecture if available)
                if (response.data.singleCourse.lectures?.length > 0) {
                    setCurrentVideo(response.data.singleCourse.lectures[0].videoUrl);
                    setCurrentVideoPoster(response.data.singleCourse.courseThumbnail);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendURL, courseId]);

    useEffect(() => {
        getSingleCourse();
    }, [getSingleCourse]);

    // Robust enrollment check
    const isEnrolled = user?.enrolledCourses?.some(course =>
        (typeof course === 'object' ? course._id : course).toString() === courseId
    );

    const handleLectureClick = (lecture) => {
        if (isEnrolled) {
            // If enrolled, play any video
            setCurrentVideo(lecture.videoUrl);
        } else {
            // If not enrolled, check if free
            if (lecture.isPreviewFree) {
                setCurrentVideo(lecture.videoUrl);
            } else {
                toast.info("Enroll in this course to watch this lecture.");
            }
        }
    };

    const enrollCourse = async () => {
        try {
            if (!token) {
                toast.warning("Please login to enroll in this course");
                return navigate("/login");
            }

            const response = await axios.post(`${backendURL}/api/course/enroll`, { userId: user._id, courseId }, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                getSingleCourse(); // Refresh course data to update UI
                // Navigate to course lectures page as requested
                navigate(`/courseLectures/${courseId}`);
            } else {
                if (response.data.requiresPayment) {
                    toast.info("This course requires payment. Redirecting to payment gateway...");
                    // Implement payment redirection here
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.log(error);
            // Show specific server error if available
            toast.error(error.response?.data?.message || error.message);
        }
    }

    if (!singleCourse) return <div className="loading">Loading...</div>;

    return (
        <div className="singleCoursePage">
            <Navbar />
            <div className="singleCourseContainer">
                <div className="singleCourseHead">
                    <h1>{singleCourse.courseTitle}</h1>
                    <div className="courseMeta">
                        <p><PersonIcon fontSize="small" /> Created By <span className="highlight">{singleCourse?.creator?.name}</span></p>
                        <p><CalendarMonthIcon fontSize="small" /> Last Updated <span>{new Date(singleCourse.updatedAt).toLocaleDateString()}</span></p>
                        <p><GroupIcon fontSize="small" /> {singleCourse?.enrolledStudents?.length || 0} Students Enrolled</p>
                    </div>
                </div>

                <div className="singleCourseContent">
                    <div className="courseMainColumn">
                        <div className="singleCourseDescription">
                            <h2>Description</h2>
                            <p>{singleCourse.description}</p>
                        </div>

                        <div className="courseLectures">
                            <div className="lecturesHeader">
                                <h2>Course Content</h2>
                                <span className="lectureCount">{singleCourse?.lectures?.length} lectures</span>
                            </div>

                            <ul className="lecturesListContainer">
                                {
                                    singleCourse?.lectures?.map((lecture, index) => (
                                        <li
                                            key={index}
                                            className={`lecSingList ${!isEnrolled && !lecture.isPreviewFree ? 'locked' : 'clickable'}`}
                                            onClick={() => handleLectureClick(lecture)}
                                        >
                                            <div className="lectureInfo">
                                                {isEnrolled || lecture.isPreviewFree ? (
                                                    <PlayCircleFilledWhiteOutlinedIcon className="playIcon" />
                                                ) : (
                                                    <LockIcon className="lockIcon" />
                                                )}
                                                <p>{lecture.lectureTitle}</p>
                                            </div>
                                            {!isEnrolled && lecture.isPreviewFree && (
                                                <span className="previewBadge">Preview</span>
                                            )}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="courseSidebar">
                        <div className="coursePreviewCard">
                            <div className="videoBox">
                                {currentVideo ? (
                                    <video
                                        src={currentVideo}
                                        controls
                                        poster={currentVideoPoster || singleCourse?.courseThumbnail}
                                        key={currentVideo} // Force re-render on video change
                                    />
                                ) : (
                                    <img src={singleCourse?.courseThumbnail} alt={singleCourse?.courseTitle} className="courseThumbnail" />
                                )}
                            </div>
                            <div className="previewCardContent">
                                <h2 className="lecturePrice">{currency}{singleCourse.coursePrice === 0 ? "Free" : singleCourse.coursePrice}</h2>
                                {
                                    isEnrolled ?
                                        <button onClick={() => navigate(`/courseLectures/${courseId}`)} className="btnType1 fullWidth">Go to Course</button>
                                        :
                                        <button onClick={enrollCourse} className="btnType1 fullWidth">Enroll Now</button>
                                }
                                <div className="courseFeatures">
                                    <p>Full Lifetime Access</p>
                                    <p>Access on Mobile and TV</p>
                                    <p>Certificate of Completion</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}