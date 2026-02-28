import "./editCourse.css"
import React, { useState, useContext, useEffect, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import LMScontext from "../../context/LMScontext"
import axios from "axios"
import { toast } from "react-toastify"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function EditCourse() {
    const navigate = useNavigate();
    const { backendURL } = useContext(LMScontext);
    const { courseId } = useParams();
    const [courseTitle, setCourseTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [courseLevel, setCourseLevel] = useState("");
    const [coursePrice, setCoursePrice] = useState("");
    const [courseThumbnail, setCourseThumbnail] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [singleCourse, setSingleCourse] = useState("");

    const updateCourse = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("courseTitle", courseTitle);
            formData.append("subTitle", subTitle);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("courseLevel", courseLevel);
            formData.append("coursePrice", coursePrice);
            formData.append("courseThumbnail", courseThumbnail);
            const response = await axios.post(`${backendURL}/api/course/update/${courseId}`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    const removeCourse = async () => {
        try {
            const response = await axios.post(`${backendURL}/api/course/delete/${courseId}`);
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

    const togglePublishCourse = async () => {
        const publishedstate = !isPublished
        try {
            const response = await axios.post(`${backendURL}/api/course/publish/${courseId}`, { isPublished: publishedstate });
            if (response.data.success) {
                toast.success(response.data.message);
                setIsPublished(publishedstate);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }


    const getSingleCourse = useCallback(async () => {
        try {
            const response = await axios.get(`${backendURL}/api/course/single/${courseId}`);
            if (response.data.success) {
                const course = response.data.singleCourse;
                setSingleCourse(course);
                setCourseTitle(course.courseTitle);
                setSubTitle(course.subTitle);
                setDescription(course.description);
                setCategory(course.category);
                setCourseLevel(course.courseLevel);
                setCoursePrice(course.coursePrice);
                setIsPublished(course.isPublished);
                setCourseThumbnail(course.courseThumbnail);
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

    return (
        <div className="editCoursePage">
            <div className="editCoursePageHeader">
                <div className="headerLeft">
                    <button onClick={() => navigate("/admin/courses")} className="backBtn">
                        <ArrowBackIcon />
                    </button>
                    <div>
                        <h1>Edit Course</h1>
                        <p>Update course details and manage content</p>
                    </div>
                </div>
                <div className="headerRight">
                    <Link className="link" to={`/admin/course/${courseId}/lecture`}>
                        <button className="btnType2">Manage Lectures</button>
                    </Link>
                </div>
            </div>

            <div className="editCourseFormContainer">
                <div className="editCourseFormHeader">
                    <div className="editBasicInfo">
                        <h3>Basic Information</h3>
                        <p>Make changes to your courses here. Click save when you're done.</p>
                    </div>
                    <div className="editCourseBtnContainer">
                        {
                            singleCourse?.lectures?.length > 0 ?
                                <button onClick={togglePublishCourse} className={isPublished ? "btnType2 unpublishBtn" : "btnType2 publishBtn"}>{
                                    isPublished ? "Unpublish" : "Publish"
                                }</button>
                                :
                                <button disabled className="btnType2 disabledBtn">Publish</button>
                        }
                        <button onClick={removeCourse} className="btnType2 deleteBtn">Remove Course</button>
                    </div>
                </div>

                <form onSubmit={updateCourse} className="editPageForm">
                    <div className="formGroup">
                        <label>Title</label>
                        <input onChange={(e) => setCourseTitle(e.target.value)} type="text" placeholder="Ex. Fullstack development" value={courseTitle} />
                    </div>
                    <div className="formGroup">
                        <label>Subtitle</label>
                        <input onChange={(e) => setSubTitle(e.target.value)} type="text" placeholder="Ex. Become a MERN stack Developer..." value={subTitle} />
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea onChange={(e) => setDescription(e.target.value)} className="formTextArea" value={description} rows={5} />
                    </div>
                    <div className="formGrid">
                        <div className="formGroup">
                            <label>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
                        <div className="formGroup">
                            <label>Course Level</label>
                            <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div className="formGroup">
                            <label>Price (INR)</label>
                            <input onChange={(e) => setCoursePrice(e.target.value)} type="number" placeholder="499" value={coursePrice} />
                        </div>
                    </div>
                    <div className="formGroup">
                        <label>Course Thumbnail</label>
                        <div className="thumbnailUpload">
                            <label className="fileChoosen" htmlFor="editFile">
                                {
                                    !courseThumbnail ?
                                        <p>No file chosen</p>
                                        :
                                        <p>{typeof courseThumbnail === 'string' ? 'Existing thumbnail' : courseThumbnail?.name}</p>
                                }
                            </label>
                            <input onChange={(e) => setCourseThumbnail(e.target.files[0])} id="editFile" type="file" hidden />
                            {
                                courseThumbnail &&
                                <div className="thumbnailPreview">
                                    <img src={typeof courseThumbnail === 'string' ? `${backendURL}/images/${courseThumbnail}` : URL.createObjectURL(courseThumbnail)} alt="Thumbnail Preview" />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="formActions">
                        <button type="button" onClick={() => navigate("/admin/courses")} className="btnType2">Cancel</button>
                        <button type="submit" className="btnType1">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}