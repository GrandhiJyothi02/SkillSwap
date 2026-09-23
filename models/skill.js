import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        tutor: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;