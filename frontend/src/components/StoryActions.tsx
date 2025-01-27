import React from "react";
import axiosInstance from "../utils/axiosInstance";

interface StoryActionsProps {
    storyId: number;
    onUpdate: () => void;
    onDelete: () => void;
}

const StoryActions: React.FC<StoryActionsProps> = ({ storyId, onUpdate, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/stories/${storyId}`);
            alert("Story deleted successfully!");
            onDelete();
        } catch (error) {
            console.error("Error deleting story:", error);
            alert("Failed to delete story.");
        }
    };

    const handleUpdate = async () => {
        const newTitle = prompt("Enter new title:");
        const newContent = prompt("Enter new content:");

        if (newTitle && newContent) {
            try {
                await axiosInstance.patch(`/stories/${storyId}`, { title: newTitle, content: newContent });
                alert("Story updated successfully!");
                onUpdate();
            } catch (error) {
                console.error("Error updating story:", error);
                alert("Failed to update story.");
            }
        }
    };

    return (
        <div>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default StoryActions;