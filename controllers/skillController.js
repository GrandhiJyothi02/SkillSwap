import Skill from "../models/skill.js";

// GET ALL SKILLS
export const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();

        res.json({
            message: "Skills fetched successfully",
            skills
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skills",
            error: error.message
        });
    }
};


// GET SKILL BY ID
export const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.json({
            message: "Skill fetched successfully",
            skill
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch skill",
            error: error.message
        });
    }
};


// CREATE SKILL
export const createSkill = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            tutor
        } = req.body;

        if (!name || !category || !description || !tutor) {
            return res.status(400).json({
                message: "Please provide name, category, description and tutor"
            });
        }

        const skill = await Skill.create({
            name,
            category,
            description,
            tutor
        });

        res.status(201).json({
            message: "Skill created successfully",
            skill
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create skill",
            error: error.message
        });
    }
};


// SEARCH SKILLS
export const searchSkills = async (req, res) => {
    try {
        const { q } = req.query;

        const skills = await Skill.find({
            name: {
                $regex: q || "",
                $options: "i"
            }
        });

        res.json({
            message: "Skills search successful",
            skills
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to search skills",
            error: error.message
        });
    }
};