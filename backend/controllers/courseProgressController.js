import courseProgressModel from "../models/courseProgressModel.js";

export const updateCourseProgress = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { courseId, lectureId } = req.body;
        let progress = await courseProgressModel.findOne({ userId, courseId });

        if (!progress) {
            progress = new courseProgressModel({
                userId,
                courseId,
                completedLectures: []
            });
        }

        if (progress.completedLectures.includes(lectureId)) {
            progress.completedLectures = progress.completedLectures.filter(id => id !== lectureId);
        } else {
            progress.completedLectures.push(lectureId);
        }

        await progress.save();
        res.json({ success: true, message: "Progress updated", progress });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getCourseProgress = async (req, res) => {
    try {
        const userId = req.userId || req.query.userId;
        const { courseId } = req.query;
        const progress = await courseProgressModel.findOne({ userId, courseId });
        res.json({ success: true, progress });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
