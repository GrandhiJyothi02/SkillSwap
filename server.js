import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

// Use Google DNS for MongoDB SRV lookup
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const app = express();

app.use(cors());
app.use(express.json());


// Home API
app.get("/", (req, res) => {
    res.json({
        message: "SkillSwap API is running"
    });
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/messages", messageRoutes);


// 404
app.use((req, res) => {
    res.status(404).json({
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});


const PORT = process.env.PORT || 5000;


// Start server after MongoDB connection
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(
                `SkillSwap server running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
    }
};

startServer();