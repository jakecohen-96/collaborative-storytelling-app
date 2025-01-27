import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const CreateStory: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleCreateStory = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axiosInstance.post("/stories", { title, content });
            alert("Story created successfully!");
            setTitle("");
            setContent("");
        } catch (error) {
            console.error("Error creating story:", error);
            alert("Failed to create story.");
        }
    };

    return (
        <form onSubmit={handleCreateStory}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit">Create Story</button>
        </form>
    );
};

export default CreateStory;