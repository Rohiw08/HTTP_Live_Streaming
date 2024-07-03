import mongoose from "mongoose"
import { Schema } from "mongoose"

const VideoSchema = new Schema(
    {
        title: {
            type: String
        },
        videoId: {
            type: String,
            unique: true,
            required: true
        },
        videoUrl: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    { collection: "VIDEO", timestamps: true }
);
export const Video = mongoose.model("Video", VideoSchema);