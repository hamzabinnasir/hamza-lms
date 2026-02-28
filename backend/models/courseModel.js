import mongoose from "mongoose"
const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
    },
    coursePrice: {
        type: Number,
    },
    courseThumbnail: {
        type: String,
    },
    enrolledStudent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lecture"
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    isPublished: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const course = mongoose.models.course || mongoose.model("course", courseSchema);
export default course;