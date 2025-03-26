import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getJobs, deleteJob } from '../services/api';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobs();
                console.log("✅ Jobs received from API:", response.data);
                setJobs(response.data);
            } catch (error) {
                console.error("❌ Error fetching jobs:", error.response?.data || error);
                setError("Failed to load jobs. Please try again.");
            }
        };

        if (user) {
            fetchJobs();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                await deleteJob(id);
                setJobs(jobs.filter(job => job.id !== id));
                console.log(`🗑️ Job with ID ${id} deleted successfully.`);
            } catch (error) {
                console.error("❌ Error deleting job:", error.response?.data || error);
                setError("Failed to delete job. Please try again.");
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Job Listings</h1>

            <button 
                style={{ 
                    marginBottom: '10px', 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    backgroundColor: '#0275d8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }} 
                onClick={() => user ? window.location.href = '/create-job' : window.location.href = '/login'}
            >
                + Add Job
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {jobs.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {jobs.map(job => (
                        <li 
                            key={job.id} 
                            style={{
                                border: '1px solid #ddd', 
                                padding: '10px', 
                                marginBottom: '8px', 
                                borderRadius: '5px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <strong>{job.company}</strong> - {job.position} ({job.status})
                                <br />
                                <small>Applied on: {job.application_date}</small>
                                <br />
                                <small>Notes: {job.notes || 'No notes'}</small>
                            </div>
                            
                            {user && user.userId === job.user_id && (
                                <div>
                                    <button 
                                        style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
                                        onClick={() => window.location.href = `/jobs/${job.id}`}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        style={{ 
                                            backgroundColor: 'red', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '5px 10px', 
                                            cursor: 'pointer' 
                                        }}
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        ❌ Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No jobs found.</p>
            )}
        </div>
    );
};

export default Home;
