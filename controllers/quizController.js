import Quiz from "../models/quiz.js";

// GET ALL QUIZZES
export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();

        res.json({
            message: "Quizzes fetched successfully",
            quizzes
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quizzes",
            error: error.message
        });
    }
};


// GET QUIZ BY ID
export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json({
            message: "Quiz fetched successfully",
            quiz
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch quiz",
            error: error.message
        });
    }
};


// CREATE QUIZ
export const createQuiz = async (req, res) => {
    try {
        const {
            question,
            options,
            answer
        } = req.body;

        if (!question || !options || !answer) {
            return res.status(400).json({
                message: "Please provide question, options and answer"
            });
        }

        const quiz = await Quiz.create({
            question,
            options,
            answer
        });

        res.status(201).json({
            message: "Quiz created successfully",
            quiz
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create quiz",
            error: error.message
        });
    }
};


// UPDATE QUIZ
export const updateQuiz = async (req, res) => {
    try {
        const {
            question,
            options,
            answer
        } = req.body;

        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            {
                question,
                options,
                answer
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json({
            message: "Quiz updated successfully",
            quiz
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update quiz",
            error: error.message
        });
    }
};


// DELETE QUIZ
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json({
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete quiz",
            error: error.message
        });
    }
};