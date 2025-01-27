import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";
import pool from "../db/connection";

// Create a new story
export const createStory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { title, content } = req.body;
    const author_id = req.user?.userId;

    if (!title || !content || !author_id) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try {
        const query = `
            INSERT INTO Stories (title, content, author_id)
            VALUES ($1, $2, $3)
            RETURNING id, title, content, author_id, created_at, updated_at
        `;
        const values = [title, content, author_id];
        const result = await pool.query(query, values);

        res.status(201).json({ story: result.rows[0] });
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ message: "Error creating story" });
    }
};

// Get all stories
export const getAllStories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const query = "SELECT * FROM Stories";
        const result = await pool.query(query);

        res.status(200).json({ stories: result.rows });
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ message: "Error fetching stories" });
    }
};

// Get a story by ID
export const getStoryById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = "SELECT * FROM Stories WHERE id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Story not found" });
            return;
        }

        res.status(200).json({ story: result.rows[0] });
    } catch (error) {
        console.error("Error fetching story:", error);
        res.status(500).json({ message: "Error fetching story" });
    }
};

// Update a story
export const updateStory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, content } = req.body;
    const author_id = req.user?.userId;

    if (!title || !content) {
        res.status(400).json({ message: "Title and content are required" });
        return;
    }

    try {
        // Check if the user is the author of the story
        const authorQuery = "SELECT author_id FROM Stories WHERE id = $1";
        const authorResult = await pool.query(authorQuery, [id]);

        if (authorResult.rows.length === 0) {
            res.status(404).json({ message: "Story not found" });
            return;
        }

        if (authorResult.rows[0].author_id !== author_id) {
            res.status(403).json({ message: "You are not authorized to update this story" });
            return;
        }

        // Update the story
        const query = `
            UPDATE Stories
            SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING id, title, content, author_id, created_at, updated_at
        `;
        const values = [title, content, id];
        const result = await pool.query(query, values);

        res.status(200).json({ story: result.rows[0] });
    } catch (error) {
        console.error("Error updating story:", error);
        res.status(500).json({ message: "Error updating story" });
    }
};

// Delete a story
export const deleteStory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const author_id = req.user?.userId;

    try {
        // Check if the user is the author of the story
        const authorQuery = "SELECT author_id FROM Stories WHERE id = $1";
        const authorResult = await pool.query(authorQuery, [id]);

        if (authorResult.rows.length === 0) {
            res.status(404).json({ message: "Story not found" });
            return;
        }

        if (authorResult.rows[0].author_id !== author_id) {
            res.status(403).json({ message: "You are not authorized to delete this story" });
            return;
        }

        // Delete the story
        const deleteQuery = "DELETE FROM Stories WHERE id = $1 RETURNING id";
        const deleteResult = await pool.query(deleteQuery, [id]);

        res.status(200).json({ message: "Story deleted", storyId: deleteResult.rows[0].id });
    } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).json({ message: "Error deleting story" });
    }
};