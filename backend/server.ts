import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import pool from "./db/connection";
import authRoutes from "./routes/authRoutes";
import storyRoutes from "./routes/storyRoutes";
import contributorRoutes from "./routes/contributorRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/stories", storyRoutes);
app.use("/contributors", contributorRoutes);

// Basic route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Collaborative Storytelling App Backend is Running!");
});

// Test database connection route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected successfully", time: result.rows[0].now });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});