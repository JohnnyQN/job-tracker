import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
            <h3>{job.company}</h3>
            <p><strong>Position:</strong> {job.position}</p>
            <p><strong>Status:</strong> {job.status}</p>

            {/* ✅ Fixed navigation to EditJob.js */}
            <button onClick={() => navigate(`/jobs/${job.id}/edit`)} style={{ marginRight: '10px' }}>
                ✏️ Edit
            </button>

            <button onClick={() => navigate(`/schedule-interview/${job.id}`)} style={{ backgroundColor: '#0275d8', color: 'white' }}>
                📅 Schedule Interview
            </button>
        </div>
    );
};

export default JobCard;
