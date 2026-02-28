import "./course.css"
import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { assets } from "../../assets/assets"
import LMScontext from "../../context/LMScontext"
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Course({ course, CN }) {
    const { currency } = useContext(LMScontext);
    return (
        <Link className="courseLink" to={`/course/${course?._id}`}>
            <div className="courseCard">
                <div className="courseThumbnailWrapper">
                    <img className="courseThumbnail" src={course?.courseThumbnail} alt={course?.courseTitle} />
                    <div className="courseOverlay">
                        <span className="viewDetailsBtn">View Details</span>
                    </div>
                </div>
                <div className="courseCardContent">
                    <div className="courseCardHeader">
                        <span className="courseLevel badge">
                            <BarChartIcon fontSize="inherit" /> {course?.courseLevel}
                        </span>
                        <span className="coursePrice">{currency}{course?.coursePrice}</span>
                    </div>

                    <h3 className="courseTitle" title={course?.courseTitle}>{course.courseTitle}</h3>

                    <div className="courseCardFooter">
                        {
                            !CN ?
                                <div className="courseCreator">
                                    <img src={course?.creator?.photoUrl ? course?.creator?.photoUrl : assets.profile_icon} alt="Creator" />
                                    <p>{course?.creator?.name}</p>
                                </div>
                                :
                                <div className="courseCreator">
                                    <div className="cn">
                                        <p>{CN}</p>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}