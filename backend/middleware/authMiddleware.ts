import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request type to include the user property
export interface AuthenticatedRequest extends Request {
    user?: { userId: number };
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization; // Get the Authorization header
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token

    if (!token) {
        res.status(401).json({ message: "Access token required" });
        return; // Stop execution
    }

    try {
        const secret = process.env.JWT_SECRET as string; // Get the JWT secret
        const payload = jwt.verify(token, secret) as { userId: number }; // Verify the token

        // Attach the user information to the request object
        req.user = { userId: payload.userId };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};