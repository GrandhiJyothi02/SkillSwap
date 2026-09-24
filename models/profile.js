import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        required: true
    },

    learningSkills: {
        type: [String],
        required: true
    }
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;