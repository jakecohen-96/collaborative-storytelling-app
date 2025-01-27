import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

interface Contributor {
    id: number;
    user_id: number;
    username: string;
}

interface ContributorManagementProps {
    storyId: number;
}

const ContributorManagement: React.FC<ContributorManagementProps> = ({ storyId }) => {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [newContributorId, setNewContributorId] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch contributors for the story
    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await axiosInstance.get(`/contributors/${storyId}`);
                setContributors(response.data.contributors);
            } catch (err) {
                console.error("Error fetching contributors:", err);
                setError("Failed to fetch contributors.");
            } finally {
                setLoading(false);
            }
        };

        fetchContributors();
    }, [storyId]);

    // Add a new contributor
    const addContributor = async () => {
        if (!newContributorId) {
            alert("Please enter a valid user ID.");
            return;
        }

        try {
            const response = await axiosInstance.post("/contributors", {
                story_id: storyId,
                user_id: newContributorId,
            });

            setContributors([...contributors, response.data.contributor]);
            setNewContributorId("");
        } catch (err) {
            console.error("Error adding contributor:", err);
            setError("Failed to add contributor.");
        }
    };

    // Remove a contributor
    const removeContributor = async (contributorId: number) => {
        try {
            await axiosInstance.delete(`/contributors/${contributorId}`);
            setContributors(contributors.filter((c) => c.id !== contributorId));
        } catch (err) {
            console.error("Error removing contributor:", err);
            setError("Failed to remove contributor.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Contributors</h3>
            <ul>
                {contributors.map((contributor) => (
                    <li key={contributor.id}>
                        {contributor.username} (User ID: {contributor.user_id})
                        <button onClick={() => removeContributor(contributor.id)}>Remove</button>
                    </li>
                ))}
            </ul>

            <div>
                <h4>Add Contributor</h4>
                <input
                    type="number"
                    placeholder="User ID"
                    value={newContributorId}
                    onChange={(e) => setNewContributorId(Number(e.target.value) || "")}
                />
                <button onClick={addContributor}>Add</button>
            </div>
        </div>
    );
};

export default ContributorManagement;