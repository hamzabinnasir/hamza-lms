import "./editProfile.css"
import React, { useContext, useEffect, useState, useCallback } from "react"
import { assets } from "../../assets/assets"
import { toast } from "react-toastify"
import LMScontext from "../../context/LMScontext"
import Course from "../../components/Course/Course"
import axios from "axios"
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../../components/Navbar/Navbar"
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function EditProfile() {
    const { backendURL, token, setUser } = useContext(LMScontext);
    const [userDetails, setUserDetails] = useState("");
    const [editPopup, setEditPopup] = useState(false);
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");

    const getUserProfile = useCallback(async () => {
        try {
            const response = await axios.get(backendURL + "/api/user/profile", { headers: { token: token } });
            if (response.data.success) {
                setUserDetails(response.data.findedUser);
                setName(response.data.findedUser.name);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }, [backendURL, token]);

    useEffect(() => {
        getUserProfile();
    }, [getUserProfile]);

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            if (photoUrl) {
                formData.append("photoUrl", photoUrl);
            }
            const response = await axios.post(backendURL + "/api/user/updateProfile", formData, { headers: { token: token } });
            if (response.data.success) {
                toast.success(response.data.message);
                getUserProfile();
                setEditPopup(false);
                setUser(prev => ({ ...prev, name: name, photoUrl: response.data.photoUrl || prev.photoUrl }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div className="editProfilePage">
            <Navbar />
            <div className="editProfileContainer">
                <div className="profileHeader">
                    <div className="profileCover"></div>
                    <div className="profileInfoWrapper">
                        <div className="profileImageContainer">
                            <img id="profileImg" src={userDetails.photoUrl ? userDetails.photoUrl : assets.profile_icon} alt="Profile" />
                        </div>
                        <div className="profileDetails">
                            <div className="profileText">
                                <h1>{userDetails.name}</h1>
                                <p className="roleBadge"><VerifiedUserIcon fontSize="small" /> {userDetails.role}</p>
                                <p className="emailText"><EmailIcon fontSize="small" /> {userDetails.email}</p>
                            </div>
                            <button onClick={() => setEditPopup(true)} className="btnType2 editProBtn">
                                <EditIcon fontSize="small" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="userEnrolledCourses">
                    <div className="sectionHeader">
                        <h2>Enrolled Courses</h2>
                        <p>Continue learning where you left off</p>
                    </div>
                    <div className="enrolledCoursesGrid">
                        {
                            userDetails?.enrolledCourses?.length > 0 ?
                                userDetails?.enrolledCourses.map((course, index) =>
                                    <Course key={index} course={course} CN={"CN"} />
                                )
                                :
                                <div className="noCoursesState">
                                    <p>You haven't enrolled in any courses yet.</p>
                                </div>
                        }
                    </div>
                </div>

                {/* Edit Popup */}
                {
                    editPopup && (
                        <div className="popupOverlay">
                            <div className="editProfilePopup">
                                <div className="popupHeader">
                                    <h3>Edit Profile</h3>
                                    <button className="closeBtn" onClick={() => setEditPopup(false)}>
                                        <CloseIcon />
                                    </button>
                                </div>
                                <p className="popupSubtitle">Update your personal details here.</p>

                                <form onSubmit={updateProfile} className="editProfilePopForm">
                                    <div className="formGroup">
                                        <label>Full Name</label>
                                        <div className="inputWrapper">
                                            <PersonIcon className="inputIcon" />
                                            <input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                type="text"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </div>
                                    <div className="formGroup">
                                        <label>Profile Photo</label>
                                        <div className="fileInputWrapper">
                                            <label htmlFor="editProPhoto" className="fileInputLabel">
                                                {photoUrl ? photoUrl.name : "Choose a new photo"}
                                            </label>
                                            <input onChange={(e) => setPhotoUrl(e.target.files[0])} hidden id="editProPhoto" type="file" accept="image/*" />
                                        </div>
                                    </div>
                                    <div className="popupActions">
                                        <button type="button" onClick={() => setEditPopup(false)} className="btnType2">Cancel</button>
                                        <button type="submit" className="btnType1">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}