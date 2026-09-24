import express from "express";

import {
    getProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfiles);
router.get("/:id", getProfileById);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;