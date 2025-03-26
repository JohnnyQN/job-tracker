import { useState } from 'react';

const JobForm = ({ onSubmit }) => {
    const [jobData, setJobData] = useState({
        company: '',
        position: '',
        status: 'applied',
        application_date: '',
        notes: ''
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(jobData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="company" placeholder="Company" onChange={handleChange} required />
            <input type="text" name="position" placeholder="Position" onChange={handleChange} required />
            <select name="status" onChange={handleChange}>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
            </select>
            <input type="date" name="application_date" onChange={handleChange} required />
            <textarea name="notes" placeholder="Notes" onChange={handleChange}></textarea>
            <button type="submit">Submit</button>
        </form>
    );
};

export default JobForm;
