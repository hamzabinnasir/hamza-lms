import { v2 as cloudinary } from "cloudinary"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import courseProgressModel from "../models/courseProgressModel.js"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let exist = await userModel.findOne({ email: email });
        if (exist) {
            return res.json({ success: false, message: "User has already Registered" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a Valid Email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter a Valid Password" });
        }

        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, async (error, hash) => {
                let newUser = await userModel.create({
                    name,
                    email,
                    password: hash
                })
                let user = await newUser.save();
                const token = jwt.sign({ email: email, userId: newUser._id }, process.env.JWT_SECRET);
                res.json({ success: true, token, message: "Account created succesfully" });
            })
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internel Server Error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let findedUser = await userModel.findOne({ email: email });
        if (!findedUser) {
            return res.json({ success: false, message: "user doesn't exist" });
        }

        bcrypt.compare(password, findedUser.password, (error, result) => {
            if (result) {
                const token = jwt.sign({ email: email, userId: findedUser._id }, process.env.JWT_SECRET);
                res.json({ success: true, token });
            } else {
                res.json({ success: false, message: "Invalid Credentials" })
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        let findedUser = await userModel.findById(userId).populate("enrolledCourses");
        if (!findedUser) {
            return res.json({ success: false, message: "Profile not found" })
        }

        const enrolledCoursesWithProgress = await Promise.all(
            findedUser.enrolledCourses.map(async (course) => {
                const progress = await courseProgressModel.findOne({ userId, courseId: course._id });
                const completedLectures = progress ? progress.completedLectures : [];
                const totalLectures = course.lectures.length;
                const progressPercentage = totalLectures > 0 ? Math.round((completedLectures.length / totalLectures) * 100) : 0;

                return {
                    ...course.toObject(),
                    progress: progressPercentage,
                    completedLectures
                };
            })
        );

        const userWithProgress = {
            ...findedUser.toObject(),
            enrolledCourses: enrolledCoursesWithProgress
        };

        res.status(200).json({ success: true, findedUser: userWithProgress });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internel Server Error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const photoUrl = req.file;

        if (!name || !photoUrl) {
            return res.json({ success: false, message: "All fields are required" });
        }

        let photoURL = null;
        if (photoUrl) {
            const response = await cloudinary.uploader.upload(photoUrl.path, { resource_type: "image" });
            photoURL = response.secure_url;
        }

        const userId = req.body.userId;

        if (!userId) {
            return res.json({ success: false, message: "User not found" })
        }

        let updatedUser = await userModel.findByIdAndUpdate(userId, {
            name,
            photoUrl: photoURL,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, messsage: "User not found" });
        }

        res.status(200).json({ success: true, message: "Profile Updated Successfully" })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Internel Server Error" });
    }
}

const getEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).populate("enrolledCourses");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, enrolledCourses: user.enrolledCourses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export { registerUser, loginUser, getUserProfile, updateProfile, getEnrolledCourses };