import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../features/authSlice";
import axiosInstance from "../utils/axiosInstance";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/auth/login", { email, password });
            const { accessToken, user } = response.data;

            // Save the user info in Redux
            dispatch(setAuth({ accessToken, user }));

            // Save token to localStorage for persistence
            localStorage.setItem("accessToken", accessToken);

            alert("Login successful!");
            navigate("/"); // Redirect to the homepage or dashboard
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;