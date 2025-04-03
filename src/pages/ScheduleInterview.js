import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scheduleInterview } from '../services/api';
import AuthContext from '../context/AuthContext';

const ScheduleInterview = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const interviewTypes = [
    'HR Interview',
    'Technical Interview',
    'Behavioral Interview',
    'Whiteboarding Session',
    'Coding Challenge',
    'Screening Interview',
    'Final Round Interview',
    'Other'
  ];

  const [interviewData, setInterviewData] = useState({
    title: interviewTypes[0],
    dateTime: '',
    duration: 30,
    location: '',
    description: '',
    jobId: jobId || ''
  });

  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState(null);

  // 💡 Fill userEmail once user context loads
  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'userEmail') {
      setUserEmail(value); // keep userEmail in sync separately
    } else {
      setInterviewData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await scheduleInterview(jobId, {
        ...interviewData,
        userEmail // inject email at submit time
      });
      alert('✅ Interview Scheduled Successfully!');
      navigate('/view-scheduled-interviews');
    } catch (err) {
      console.error("❌ Error scheduling interview:", err);
      setError('Failed to schedule interview. Please try again.');
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '500px',
      margin: 'auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>📅 Schedule Interview</h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontWeight: 'bold' }}>Interview Title:</label>
        <select
          name="title"
          value={interviewData.title}
          onChange={handleChange}
          style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          {interviewTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>

        <label style={{ fontWeight: 'bold' }}>Date & Time:</label>
        <input
          type="datetime-local"
          name="dateTime"
          value={interviewData.dateTime}
          onChange={handleChange}
          required
          style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Duration (minutes):</label>
        <input
          type="number"
          name="duration"
          value={interviewData.duration}
          onChange={handleChange}
          min="1"
          required
          style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Location:</label>
        <input
          type="text"
          name="location"
          value={interviewData.location}
          onChange={handleChange}
          style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Attendee Email:</label>
        <input
          type="email"
          name="userEmail"
          value={userEmail}
          onChange={handleChange}
          required
          placeholder="Enter email address"
          style={{ padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <label style={{ fontWeight: 'bold' }}>Description:</label>
        <textarea
          name="description"
          value={interviewData.description}
          onChange={handleChange}
          style={{ height: '100px', padding: '8px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <button
            type="submit"
            style={{ backgroundColor: '#0275d8', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
          >
            ✅ Schedule Interview
          </button>
          <button
            type="button"
            onClick={() => navigate(`/view-scheduled-interviews`)}
            style={{ backgroundColor: '#d9534f', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleInterview;
