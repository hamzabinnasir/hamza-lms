import express from 'express';
import { getCourseProgress, updateCourseProgress } from '../controllers/courseProgressController.js';
import userAuth from '../middleware/userAuth.js';

const courseProgressRouter = express.Router();

courseProgressRouter.post('/update', userAuth, updateCourseProgress);
courseProgressRouter.get('/get', userAuth, getCourseProgress);

export default courseProgressRouter;
