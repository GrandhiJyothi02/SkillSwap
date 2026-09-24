import mongoose from "mongoose";
import User from "./user.js";

const meetingSchema = new mongoose.Schema(
    {
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        learner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        skill: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        duration: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;