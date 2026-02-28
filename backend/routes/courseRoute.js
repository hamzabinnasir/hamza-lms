import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js"
import express from "express"
import { createCourse, deleteCourse, editCourse, getCreatorCourses, singleCourse, createLecture, editLecture, removeLecture, courseLectures, singleLecture, togglePublishCourse, getPublishedCourses, enrollCourse, getUserEnrolledCourses } from "../controllers/courseController.js";
const courseRouter = express.Router();
courseRouter.post("/course/create", userAuth, createCourse);
courseRouter.post("/course/delete/:courseId", deleteCourse);
courseRouter.post("/course/update/:courseId", upload.single("courseThumbnail"), editCourse);
courseRouter.get("/course/all", userAuth, getCreatorCourses);
courseRouter.get("/course/single/:courseId", singleCourse);
courseRouter.post("/course/publish/:courseId", togglePublishCourse);
courseRouter.get("/course/publishedCourses", getPublishedCourses)
courseRouter.get("/course/my-courses", userAuth, getUserEnrolledCourses);
courseRouter.post("/course/enroll", userAuth, enrollCourse);
courseRouter.post("/lecture/create/:courseId", createLecture);
courseRouter.post("/lecture/edit/:lectureId", upload.single("videoUrl"), editLecture);
courseRouter.post("/lecture/remove/:courseId/:lectureId", removeLecture);
courseRouter.get("/lecture/courseLectures/:courseId", courseLectures);
courseRouter.get("/lecture/single/:lectureId", singleLecture);

export default courseRouter;
