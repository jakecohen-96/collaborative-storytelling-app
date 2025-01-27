import express from "express";
import {
    addContributor,
    getContributorsByStory,
    removeContributor,
} from "../controllers/contributorController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Add a contributor to a story
router.post("/", authenticateToken, addContributor);

// Get all contributors for a specific story
router.get("/:story_id", authenticateToken, getContributorsByStory);

// Remove a contributor from a story
router.delete("/:id", authenticateToken, removeContributor);

export default router;