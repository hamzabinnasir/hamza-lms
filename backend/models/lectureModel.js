import mongoose from "mongoose"
const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        // required: true,
    },
    videoUrl: {
        type: String,
        // required: true,
    },
    isPreviewFree: {
        type: Boolean,
        default: false,
    },
    publicId: {
        type: String,
    }
}, { timestamps: true })

const lecture = mongoose.models.lecture || mongoose.model("lecture", lectureSchema);
export default lecture;