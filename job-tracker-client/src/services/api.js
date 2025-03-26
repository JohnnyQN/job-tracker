import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get token and refresh if needed
const getAuthHeader = () => {
    let token = localStorage.getItem('token');
    if (!token) {
        console.warn("⚠️ No token found in localStorage.");
        return {};
    }

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("⚠️ Token expired. Logging out...");
            localStorage.removeItem('token');
            window.location.href = '/login';
            return {};
        }
    } catch (error) {
        console.error("⚠️ Error decoding token:", error);
        return {};
    }

    return { Authorization: `Bearer ${token}` };
};

// API Calls
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        console.log("✅ User registered:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error registering user:", error.response?.data || error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        console.log("✅ User logged in:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error logging in:", error.response?.data || error);
        throw error;
    }
};

export const getJobs = async () => {
    try {
        console.log("📡 Fetching jobs...");
        const response = await axios.get(`${API_URL}/jobs`, { headers: getAuthHeader() });
        console.log("✅ Jobs retrieved:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error fetching jobs:", error.response?.data || error);
        throw error;
    }
};

export const getJobById = async (id) => {
    try {
        console.log(`📡 Fetching job details for ID ${id}`);
        const response = await axios.get(`${API_URL}/jobs/${id}`, { headers: getAuthHeader() });
        console.log("✅ Job details retrieved:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error fetching job details:", error.response?.data || error);
        throw error;
    }
};

export const createJob = async (jobData) => {
    try {
        console.log("📡 Creating job:", jobData);
        const response = await axios.post(`${API_URL}/jobs`, jobData, { headers: getAuthHeader() });
        console.log("✅ Job created:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error creating job:", error.response?.data || error);
        throw error;
    }
};

export const updateJob = async (id, jobData) => {
    try {
        console.log(`📡 Updating job ID ${id}:`, jobData);
        const response = await axios.put(`${API_URL}/jobs/${id}`, jobData, { headers: getAuthHeader() });
        console.log("✅ Job updated:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error updating job:", error.response?.data || error);
        throw error;
    }
};

export const scheduleInterview = async (jobId, interviewData) => {
    try {
        console.log(`📡 Scheduling interview for Job ID ${jobId}:`, interviewData);
        const response = await axios.post(`${API_URL}/calendar/schedule`, { jobId, ...interviewData }, { headers: getAuthHeader() });
        console.log("✅ Interview scheduled:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error scheduling interview:", error.response?.data || error);
        throw error;
    }
};

// ✅ Fetch Scheduled Interviews
export const fetchScheduledInterviews = async () => {
    try {
        console.log("📡 Fetching scheduled interviews...");
        const response = await axios.get(`${API_URL}/calendar/scheduled`, { headers: getAuthHeader() });
        console.log("✅ API Response from Backend:", response.data);

        // Since our backend returns an array directly, check if response.data is an array:
        const data = Array.isArray(response.data) ? response.data : response.data.items;

        if (!data || data.length === 0) {
            console.warn("⚠️ No interviews found in the response.");
            return [];
        }

        console.log("📅 Full event list:", data);

        // (Optionally, you can add further filtering based on interview keywords if desired)
        const jobInterviews = data.filter(event => true);
        console.log("✅ Filtered Job Interviews:", jobInterviews);
        return jobInterviews;
    } catch (error) {
        console.error("❌ Error fetching scheduled interviews:", error);
        return [];
    }
};

// ✅ Edit Interview - Fetch Interview by ID
export const getInterviewById = async (eventId) => {
    try {
        console.log(`📡 Fetching interview details for ID: ${eventId}`);
        const response = await axios.get(`${API_URL}/calendar/interview/${eventId}`, { headers: getAuthHeader() });
        console.log("✅ Interview details retrieved:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error fetching interview:", error.response?.data || error);
        throw error;
    }
};

// ✅ Update Interview
export const updateInterview = async (eventId, interviewData) => {
    try {
        console.log(`📡 Updating interview ID ${eventId}:`, interviewData);
        const response = await axios.put(`${API_URL}/calendar/interview/${eventId}`, interviewData, { headers: getAuthHeader() });
        console.log("✅ Interview updated:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error updating interview:", error.response?.data || error);
        throw error;
    }
};

// ✅ Cancel Interview
export const cancelInterview = async (eventId) => {
    try {
        console.log(`📡 Cancelling interview: ${eventId}`);
        const response = await axios.delete(`${API_URL}/calendar/cancel/${eventId}`, { headers: getAuthHeader() });
        console.log("✅ Interview cancelled:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Error canceling interview:", error.response?.data || error);
        throw error;
    }
};

export const deleteJob = async (id) => {
    try {
        console.log(`📡 Deleting job ID ${id}`);
        const response = await axios.delete(`${API_URL}/jobs/${id}`, { headers: getAuthHeader() });
        console.log("✅ Job deleted");
        return response;
    } catch (error) {
        console.error("❌ Error deleting job:", error.response?.data || error);
        throw error;
    }
};
