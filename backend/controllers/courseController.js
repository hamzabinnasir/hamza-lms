// controllers/courseController.js

import courseModel from "../models/courseModel.js";
import lectureModel from "../models/lectureModel.js";
import userModel from "../models/userModel.js";
import courseProgressModel from "../models/courseProgressModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

/**
 * Create a course
 */
const createCourse = async (req, res) => {
    try {
        const { courseTitle, category, userId } = req.body;

        if (!courseTitle || !category || !userId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const course = await courseModel.create({
            courseTitle,
            category,
            creator: userId,
            isPublished: false,
            lectures: [],
        });

        return res.status(201).json({ success: true, message: "Course created", course });
    } catch (error) {
        console.error("createCourse error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Edit course (with thumbnail upload)
 */
const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const { courseTitle, subTitle, description, category, courseLevel, coursePrice, isPublished } = req.body;
        const courseThumbnail = req.file;

        // Basic required fields validation
        if (!courseTitle || !subTitle || !description || !category || !courseLevel || !coursePrice) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        let courseThumbnailURL = undefined;
        if (courseThumbnail) {
            try {
                const response = await cloudinary.uploader.upload(courseThumbnail.path, { resource_type: "image" });
                courseThumbnailURL = response.secure_url;
                // optionally delete local file if you store uploads temporarily
                try { await fs.unlink(courseThumbnail.path); } catch (e) { /* ignore */ }
            } catch (uploadError) {
                console.error("Cloudinary Error:", uploadError);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        const updatePayload = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice,
            isPublished: !!isPublished,
        };
        if (courseThumbnailURL) updatePayload.courseThumbnail = courseThumbnailURL;

        const editedCourse = await courseModel.findByIdAndUpdate(courseId, updatePayload, { new: true });

        if (!editedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, message: "Course edited successfully", editedCourse });
    } catch (error) {
        console.error("editCourse error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Delete a course
 */
const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const deletedCourse = await courseModel.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Optionally remove associated lectures (if that is desired)
        // await lectureModel.deleteMany({ _id: { $in: deletedCourse.lectures } });

        return res.status(200).json({ success: true, message: "Course deleted successfully", deletedCourse });
    } catch (error) {
        console.error("deleteCourse error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Toggle publish status of a course
 */
const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const { isPublished } = req.body;
        const publishedCourse = await courseModel.findByIdAndUpdate(
            courseId,
            { isPublished: !!isPublished },
            { new: true }
        );

        if (!publishedCourse) {
            return res.status(404).json({ success: false, message: "Unable to update published status" });
        }

        return res.status(200).json({
            success: true,
            message: publishedCourse.isPublished ? "Course is published" : "Course is unpublished",
            course: publishedCourse,
        });
    } catch (error) {
        console.error("togglePublishCourse error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Get published courses with optional search filter
 */
const getPublishedCourses = async (req, res) => {
    try {
        const { searchDetails } = req.query;
        const query = { isPublished: true };

        if (searchDetails) {
            // if numeric search for price convert; otherwise use regex
            const priceValue = Number(searchDetails);
            const orQueries = [
                { courseTitle: { $regex: searchDetails, $options: "i" } },
                { subTitle: { $regex: searchDetails, $options: "i" } },
                { description: { $regex: searchDetails, $options: "i" } },
                { category: { $regex: searchDetails, $options: "i" } },
                { courseLevel: { $regex: searchDetails, $options: "i" } },
            ];
            if (!Number.isNaN(priceValue)) orQueries.push({ coursePrice: priceValue });
            query.$or = orQueries;
        }

        const publishedCourses = await courseModel
            .find(query)
            .populate({ path: "creator", select: "name photoUrl" });

        return res.status(200).json({ success: true, publishedCourses });
    } catch (error) {
        console.error("getPublishedCourses error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Get all courses created by a particular creator (for "creator dashboard")
 */
const getCreatorCourses = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId);
        let courses;
        if (user && user.role === "admin") {
            courses = await courseModel.find({}).populate("creator", "name photoUrl");
        } else {
            courses = await courseModel.find({ creator: userId }).populate("creator", "name photoUrl");
        }

        return res.status(200).json({ success: true, creatorCourses: courses });
    } catch (error) {
        console.error("getCreatorCourses error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Get a single course by id
 */
const singleCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const course = await courseModel.findById(courseId).populate("lectures").populate("creator", "name photoUrl");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, singleCourse: course });
    } catch (error) {
        console.error("singleCourse error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Create a lecture and attach to a course
 */
const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle) {
            return res.status(400).json({ success: false, message: "Lecture title is required" });
        }
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const lecture = await lectureModel.create({ lectureTitle });

        const course = await courseModel.findById(courseId);
        if (!course) {
            // rollback lecture creation if desired
            await lectureModel.findByIdAndDelete(lecture._id);
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        course.lectures.push(lecture._id);
        await course.save();

        const courseLectures = await courseModel.findById(courseId).populate("lectures");
        return res.status(201).json({ success: true, message: "Lecture created successfully", courseLectures: courseLectures.lectures });
    } catch (error) {
        console.error("createLecture error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Edit lecture (upload video)
 */
const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        if (!lectureId) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        const { lectureTitle, isPreviewFree } = req.body;
        const videoFile = req.file;

        if (!lectureTitle) {
            return res.status(400).json({ success: false, message: "Lecture title is required" });
        }

        let videoURL;
        if (videoFile) {
            try {
                const response = await cloudinary.uploader.upload(videoFile.path, { resource_type: "video" });
                videoURL = response.secure_url;
                try { await fs.unlink(videoFile.path); } catch (e) { /* ignore */ }
            } catch (uploadError) {
                console.error("Cloudinary video upload error:", uploadError);
                return res.status(500).json({ success: false, message: "Video upload failed" });
            }
        }

        const update = {
            lectureTitle,
            isPreviewFree: !!isPreviewFree,
        };
        if (videoURL) update.videoUrl = videoURL;

        const updatedLecture = await lectureModel.findByIdAndUpdate(lectureId, update, { new: true });
        if (!updatedLecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        return res.status(200).json({ success: true, message: "Lecture updated successfully", updatedLecture });
    } catch (error) {
        console.error("editLecture error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Remove a lecture from a course (does not delete lecture doc by default)
 */
const removeLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        if (!courseId || !lectureId) {
            return res.status(400).json({ success: false, message: "Course ID and Lecture ID are required" });
        }

        const course = await courseModel.findByIdAndUpdate(
            courseId,
            { $pull: { lectures: lectureId } },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Optionally delete the lecture document entirely:
        // await lectureModel.findByIdAndDelete(lectureId);

        return res.status(200).json({ success: true, message: "Lecture removed successfully", course });
    } catch (error) {
        console.error("removeLecture error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Get lectures for a course
 */
const courseLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const course = await courseModel.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, data: course.lectures });
    } catch (error) {
        console.error("courseLectures error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Get a single lecture
 */
const singleLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        if (!lectureId) {
            return res.status(400).json({ success: false, message: "Lecture ID is required" });
        }

        const foundLecture = await lectureModel.findById(lectureId);
        if (!foundLecture) {
            return res.status(404).json({ success: false, message: "Lecture not found" });
        }

        return res.status(200).json({ success: true, findedLecture: foundLecture });
    } catch (error) {
        console.error("singleLecture error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Enroll user in a course
 */
const enrollCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: "User ID and Course ID are required" });
        }

        const user = await userModel.findById(userId);
        const course = await courseModel.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ success: false, message: "User or Course not found" });
        }

        // Check if already enrolled
        if (user.enrolledCourses.some(id => id.toString() === courseId)) {
            return res.status(400).json({ success: false, message: "User already enrolled in this course" });
        }

        // Check if course is free OR bypass payment for now
        if (course.coursePrice === 0 || true) { // TEMPORARY: Allow enrollment for paid courses
            user.enrolledCourses.push(courseId);
            course.enrolledStudent.push(userId);

            await user.save();
            await course.save();

            return res.status(200).json({ success: true, message: "Enrolled successfully" });
        } else {
            return res.status(200).json({ success: false, requiresPayment: true, message: "Payment required for this course" });
        }

    } catch (error) {
        console.error("enrollCourse error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


/**
 * Get all courses enrolled by a user
 */
const getUserEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.body; // userAuth middleware adds userId to body

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId).populate({
            path: "enrolledCourses",
            populate: { path: "creator", select: "name photoUrl" }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const enrolledCoursesWithProgress = await Promise.all(
            user.enrolledCourses.map(async (course) => {
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

        return res.status(200).json({ success: true, enrolledCourses: enrolledCoursesWithProgress });
    } catch (error) {
        console.error("getUserEnrolledCourses error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {
    createCourse,
    deleteCourse,
    editCourse,
    getCreatorCourses,
    singleCourse,
    createLecture,
    editLecture,
    removeLecture,
    courseLectures,
    singleLecture,
    togglePublishCourse,
    getPublishedCourses,
    enrollCourse,
    getUserEnrolledCourses,
};
