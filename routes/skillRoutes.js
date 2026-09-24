import express from "express";

import {
    getSkills,
    getSkillById,
    createSkill,
    searchSkills
} from "../controllers/skillController.js";

const router = express.Router();

router.get("/", getSkills);

router.get("/search", searchSkills);

router.get("/:id", getSkillById);

router.post("/", createSkill);

export default router;