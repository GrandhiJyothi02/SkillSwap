import express from "express";

const router = express.Router();

// Temporary user data
const users = [
    {
        id: 1,
        name: "Jyothi",
        email: "jyothi@example.com",
        skills: ["Java", "HTML", "CSS"]
    },
    {
        id: 2,
        name: "Rahul",
        email: "rahul@example.com",
        skills: ["Python", "React", "Node.js"]
    }
];

// Get all users
router.get("/", (req, res) => {
    res.json({
        message: "Users fetched successfully",
        users
    });
});

// Get user by ID
router.get("/:id", (req, res) => {
    const user = users.find(
        user => user.id === parseInt(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});

export default router;