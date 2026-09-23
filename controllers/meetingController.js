import Meeting from "../models/meeting.js";

// GET ALL MEETINGS
export const getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate("tutor", "name email")
            .populate("learner", "name email");

        res.json({
            message: "Meetings fetched successfully",
            meetings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch meetings",
            error: error.message
        });
    }
};


// GET MEETING BY ID
export const getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate("tutor", "name email")
            .populate("learner", "name email");

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found"
            });
        }

        res.json({
            message: "Meeting fetched successfully",
            meeting
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch meeting",
            error: error.message
        });
    }
};


// CREATE MEETING
export const createMeeting = async (req, res) => {
    try {
        const {
            tutor,
            learner,
            skill,
            date,
            duration
        } = req.body;

        // Check required fields
        if (
            !tutor ||
            !learner ||
            !skill ||
            !date ||
            duration === undefined
        ) {
            return res.status(400).json({
                message: "Please provide tutor, learner, skill, date and duration"
            });
        }

        const meeting = await Meeting.create({
            tutor,
            learner,
            skill,
            date,
            duration
        });

        res.status(201).json({
            message: "Meeting created successfully",
            meeting
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create meeting",
            error: error.message
        });
    }
};


// UPDATE MEETING
export const updateMeeting = async (req, res) => {
    try {
        const {
            tutor,
            learner,
            skill,
            date,
            duration
        } = req.body;

        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            {
                tutor,
                learner,
                skill,
                date,
                duration
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found"
            });
        }

        res.json({
            message: "Meeting updated successfully",
            meeting
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update meeting",
            error: error.message
        });
    }
};


// DELETE MEETING
export const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found"
            });
        }

        res.json({
            message: "Meeting deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete meeting",
            error: error.message
        });
    }
};