import Message from "../models/message.js";


// SEND MESSAGE
export const sendMessage = async (req, res) => {
    try {
        const {
            sender,
            receiver,
            message
        } = req.body;

        if (!sender || !receiver || !message) {
            return res.status(400).json({
                message: "Please provide sender, receiver and message"
            });
        }

        const newMessage = await Message.create({
            sender,
            receiver,
            message
        });

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name email")
            .populate("receiver", "name email");

        res.status(201).json({
            message: "Message sent successfully",
            data: populatedMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
};


// GET CONVERSATION
export const getConversation = async (req, res) => {
    try {
        const {
            senderId,
            receiverId
        } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    sender: senderId,
                    receiver: receiverId
                },
                {
                    sender: receiverId,
                    receiver: senderId
                }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "name email")
        .populate("receiver", "name email");

        res.json({
            message: "Conversation fetched successfully",
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch conversation",
            error: error.message
        });
    }
};


// MARK MESSAGE AS READ
export const markMessageAsRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true
            },
            {
                new: true
            }
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.json({
            message: "Message marked as read",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update message",
            error: error.message
        });
    }
};


// DELETE MESSAGE
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(
            req.params.id
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete message",
            error: error.message
        });
    }
};