import { Request, Response } from "express";
import pool from "../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

// User Registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const query = `
            INSERT INTO Users (username, email, password_hash) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, email
        `;
        const values = [username, email, hashedPassword];
        const result = await pool.query(query, values);

        res.status(201).json({ user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try {
        const query = `SELECT * FROM Users WHERE email = $1`;
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};