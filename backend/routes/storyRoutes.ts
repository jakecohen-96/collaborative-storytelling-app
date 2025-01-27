import express from "express";
import {
    createStory,
    getAllStories,
    getStoryById,
    updateStory,
    deleteStory,
} from "../controllers/storyController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Public route: Get all stories
router.get("/", getAllStories);

// Public route: Get a story by ID
router.get("/:id", getStoryById);

// Protected route: Create a new story
router.post("/", authenticateToken, createStory);

// Protected route: Update a story
router.patch("/:id", authenticateToken, updateStory);

// Protected route: Delete a story
router.delete("/:id", authenticateToken, deleteStory);

export default router;