import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getJobs, updateJob, deleteJob } from '../services/api';

console.log("🔥 EditJob component is rendering!");

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // Track Job and Form Data
    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                console.log(`📡 Fetching job details for ID ${id}...`);
                const response = await getJobs();
                const jobToEdit = response.data.find(j => j.id === parseInt(id));

                if (jobToEdit) {
                    console.log("✅ Job found:", jobToEdit);
                    setJob(jobToEdit);
                    setFormData({
                        company: jobToEdit.company,
                        position: jobToEdit.position,
                        status: jobToEdit.status,
                        notes: jobToEdit.notes || '',
                    });
                } else {
                    console.warn("⚠️ No job found for this ID. Redirecting...");
                    navigate('/');
                }
            } catch (error) {
                console.error("❌ Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchJob();
    }, [id, user, navigate]);

    // Ensure formData is set before rendering the form
    if (loading) {
        console.log("⏳ Waiting for job data to load...");
        return <p>Loading job details...</p>;
    }

    if (!formData) {
        console.error("❌ Error: Form data is null. Something went wrong.");
        return <p>Error loading job details. Please try again.</p>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("📡 Updating job with data:", formData);
            await updateJob(id, formData);
            navigate('/');
        } catch (error) {
            console.error("❌ Error updating job:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                console.log(`🗑 Deleting job ID ${id}...`);
                await deleteJob(id);
                navigate('/');
            } catch (error) {
                console.error("❌ Error deleting job:", error);
            }
        }
    };

    return (
        <div key={job.id} style={{ padding: '20px', maxWidth: '500px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>✏️ Edit Job</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Company:</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required />

                <label>Position:</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} required />

                <label>Status:</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                </select>

                <label>Notes:</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} />

                {/* ✅ Buttons Container for Better Spacing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    
                    {/* ✅ Top Row - Save & Delete */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <button 
                            type="submit" 
                            style={{ flex: 1, backgroundColor: '#0275d8', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            💾 Save Changes
                        </button>

                        <button 
                            type="button" 
                            onClick={handleDelete} 
                            style={{ flex: 1, backgroundColor: '#d9534f', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            🗑 Delete Job
                        </button>
                    </div>

                    {/* ✅ Second Row - Schedule Interview & View Scheduled Interviews */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate(`/schedule-interview/${id}`)} 
                            style={{ backgroundColor: '#5cb85c', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                        >
                            📅 Schedule Interview
                        </button>

                        <button 
                            type="button" 
                            onClick={() => navigate('/view-scheduled-interviews')}
                            style={{ backgroundColor: '#f0ad4e', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                        >
                            📄 View Scheduled Interviews
                        </button>
                    </div>

                    {/* ✅ Third Row - Cancel Button */}
                    <button 
                        type="button" 
                        onClick={() => navigate('/')} 
                        style={{ backgroundColor: '#6c757d', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
                    >
                        ❌ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditJob;
