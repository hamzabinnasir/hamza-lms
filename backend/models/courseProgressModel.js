import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    completedLectures: [
        {
            type: String, // lectureId
        }
    ]
}, { minimize: false });

const courseProgressModel = mongoose.models.courseProgress || mongoose.model("courseProgress", courseProgressSchema);

export default courseProgressModel;
