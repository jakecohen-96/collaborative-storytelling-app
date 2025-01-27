import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import pool from "../db/connection";

// Add a contributor to a story
export const addContributor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { story_id, user_id } = req.body;

    if (!story_id || !user_id) {
        res.status(400).json({ message: "Story ID and User ID are required" });
        return;
    }

    try {
        // Check if the story exists
        const storyQuery = "SELECT * FROM Stories WHERE id = $1";
        const storyResult = await pool.query(storyQuery, [story_id]);

        if (storyResult.rows.length === 0) {
            res.status(404).json({ message: "Story not found" });
            return;
        }

        // Add the contributor
        const query = `
            INSERT INTO Contributors (story_id, user_id)
            VALUES ($1, $2)
            RETURNING id, story_id, user_id
        `;
        const values = [story_id, user_id];
        const result = await pool.query(query, values);

        res.status(201).json({ contributor: result.rows[0] });
    } catch (error) {
        console.error("Error adding contributor:", error);
        res.status(500).json({ message: "Error adding contributor" });
    }
};

// Get all contributors for a specific story
export const getContributorsByStory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { story_id } = req.params;

    try {
        const query = `
            SELECT c.id, c.user_id, u.username
            FROM Contributors c
            JOIN Users u ON c.user_id = u.id
            WHERE c.story_id = $1
        `;
        const result = await pool.query(query, [story_id]);

        res.status(200).json({ contributors: result.rows });
    } catch (error) {
        console.error("Error fetching contributors:", error);
        res.status(500).json({ message: "Error fetching contributors" });
    }
};

// Remove a contributor from a story
export const removeContributor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const query = "DELETE FROM Contributors WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Contributor not found" });
            return;
        }

        res.status(200).json({ message: "Contributor removed", contributorId: result.rows[0].id });
    } catch (error) {
        console.error("Error removing contributor:", error);
        res.status(500).json({ message: "Error removing contributor" });
    }
};