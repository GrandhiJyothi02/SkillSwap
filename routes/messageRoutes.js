import express from "express";

import {
    sendMessage,
    getConversation,
    markMessageAsRead,
    deleteMessage
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);

router.get("/:senderId/:receiverId", getConversation);

router.put("/:id/read", markMessageAsRead);

router.delete("/:id", deleteMessage);

export default router;