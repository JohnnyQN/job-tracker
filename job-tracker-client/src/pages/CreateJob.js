import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';
import AuthContext from '../context/AuthContext';

const CreateJob = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [jobData, setJobData] = useState({
        company: '',
        position: '',
        status: 'applied',  // Default status
        application_date: new Date().toISOString().split('T')[0], 
        notes: ''
    });

    const [error, setError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await createJob(jobData);
            alert("✅ Job created successfully!");
            navigate('/');
        } catch (err) {
            console.error("❌ Error creating job:", err);
            setError('⚠️ Failed to create job. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Add a New Job</h1>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold' }}>Company:</label>
                <input
                    type="text"
                    name="company"
                    value={jobData.company}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label style={{ fontWeight: 'bold' }}>Position:</label>
                <input
                    type="text"
                    name="position"
                    value={jobData.position}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label style={{ fontWeight: 'bold' }}>Status:</label>
                <select 
                    name="status" 
                    value={jobData.status} 
                    onChange={handleChange} 
                    required
                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                </select>

                <label style={{ fontWeight: 'bold' }}>Application Date:</label>
                <input
                    type="date"
                    name="application_date"
                    value={jobData.application_date}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label style={{ fontWeight: 'bold' }}>Notes:</label>
                <textarea
                    name="notes"
                    value={jobData.notes}
                    onChange={handleChange}
                    style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', height: '100px' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                    <button 
                        type="submit"
                        style={{ backgroundColor: '#0275d8', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        💾 Save Job
                    </button>

                    <button 
                        type="button"
                        onClick={() => navigate('/')}
                        style={{ backgroundColor: '#d9534f', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        ❌ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateJob;
