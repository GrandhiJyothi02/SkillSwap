import express from "express";

import {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;