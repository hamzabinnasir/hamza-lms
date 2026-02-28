import express from "express"
import upload from "../middleware/multer.js"
import userAuth from "../middleware/userAuth.js"
const userRouter = express.Router();
import { registerUser, loginUser, getUserProfile, updateProfile, getEnrolledCourses } from "../controllers/userController.js"

userRouter.post("/user/register", registerUser);
userRouter.post("/user/login", loginUser);
userRouter.get("/user/profile", userAuth, getUserProfile);
userRouter.post("/user/updateProfile", upload.single("photoUrl"), userAuth, updateProfile);
userRouter.get("/user/enrolled-courses", userAuth, getEnrolledCourses);

export default userRouter;




