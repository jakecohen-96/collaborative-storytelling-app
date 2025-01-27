import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import CreateStory from "../components/CreateStory";
import StoryActions from "../components/StoryActions";
import ContributorManagement from "../components/ContributorManagement";

interface Story {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: string;
    updated_at: string;
}

const StoryList: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStories = async () => {
        try {
            const response = await axiosInstance.get("/stories");
            setStories(response.data.stories);
        } catch (err) {
            console.error("Error fetching stories:", err);
            setError("Failed to load stories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>All Stories</h1>
            <CreateStory />
            <ul>
                {stories.map((story) => (
                    <li key={story.id}>
                        <h2>{story.title}</h2>
                        <p>{story.content}</p>
                        <small>Author ID: {story.author_id}</small>
                        <StoryActions storyId={story.id} onUpdate={fetchStories} onDelete={fetchStories} />
                        <ContributorManagement storyId={story.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StoryList;