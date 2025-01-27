import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5001",
    withCredentials: true, 
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken"); // get token from storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;