import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoryList from "./pages/StoryList";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <StoryList />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;