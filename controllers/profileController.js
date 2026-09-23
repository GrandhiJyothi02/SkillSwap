import Profile from "../models/profile.js";

export const getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();

        res.json({
            message: "Profiles fetched successfully",
            profiles
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profiles",
            error: error.message
        });
    }
};

export const getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            id: req.params.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};

export const createProfile = async (req, res) => {
    try {
        const profile = await Profile.create(req.body);

        res.status(201).json({
            message: "Profile created successfully",
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create profile",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            message: "Profile updated successfully",
            profile
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete({
            id: req.params.id
        });

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json({
            message: "Profile deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete profile",
            error: error.message
        });
    }
};