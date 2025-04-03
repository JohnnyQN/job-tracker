import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, updateJob, deleteJob } from '../services/api';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const alertShown = useRef(false);
    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: '',
        application_date: '',
        notes: '',
    });
    const [isChanged, setIsChanged] = useState(false); 

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await getJobById(id);
                setJob(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("❌ Error fetching job details:", error);
                if (!error.response || error.response.status === 404) {
                    if (!alertShown.current) {
                        alertShown.current = true;
                        alert("⚠️ Job not found or unauthorized.");
                        navigate('/');
                    }
                }
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsChanged(true); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChanged) {
            alert("⚠️ No changes detected.");
            return;
        }
        try {
            await updateJob(id, formData);
            alert("✅ Job updated successfully!");
            setIsChanged(false);
        } catch (error) {
            alert("❌ Failed to update job. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await deleteJob(id);
                alert("🗑 Job deleted successfully.");
                navigate('/');
            } catch (error) {
                alert("❌ Failed to delete job. Please try again.");
            }
        }
    };

    if (!job) return <p>Loading job details...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Job</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Company:</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required />

                <label>Position:</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} required />

                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleChange} required>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                </select>

                <label>Application Date:</label>
                <input type="date" name="application_date" value={formData.application_date} onChange={handleChange} required />

                <label>Notes:</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                    <button type="submit" disabled={!isChanged} style={{ backgroundColor: isChanged ? '#0275d8' : 'gray', color: 'white' }}>
                        💾 Save Changes
                    </button>
                    <button type="button" onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>🗑 Delete Job</button>
                </div>
            </form>

            {/* ✅ Fixed "Schedule Interview" Button */}
            <button 
                onClick={() => navigate(`/schedule-interview/${id}`)} 
                style={{ marginTop: '10px', backgroundColor: '#0275d8', color: 'white' }}>
                📅 Schedule Interview
            </button>

            {/* ✅ Fixed "View Scheduled Interviews" Button */}
            <button 
                onClick={() => navigate('/view-scheduled-interviews')} 
                style={{ marginTop: '10px', backgroundColor: '#5cb85c', color: 'white' }}>
                👀 View Scheduled Interviews
            </button>

            <button 
                onClick={() => navigate('/')} 
                style={{ marginTop: '10px', backgroundColor: 'gray', color: 'white' }}>
                ❌ Cancel
            </button>
        </div>
    );
};

export default JobDetails;
