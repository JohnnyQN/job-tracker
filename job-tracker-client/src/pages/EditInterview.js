import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInterviewById, updateInterview, getJobById } from '../services/api';
import AuthContext from '../context/AuthContext';

const EditInterview = () => {
  const { id } = useParams();  // interview ID
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
    title: '',
    dateTime: '',
    duration: 30,
    location: '',
    userEmail: '',
    description: '',
    jobId: '',
    company: '',
    position: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the interview details + job details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const resp = await getInterviewById(id);
        const iv = resp.data;
        if (!iv) {
          setError("Interview not found.");
          setLoading(false);
          return;
        }

        let formattedDate = iv.date?.split('T')[0]; // YYYY-MM-DD
        let formattedTime = iv.time?.substring(0, 5); // HH:mm
        const dateTimeValue = formattedDate && formattedTime ? `${formattedDate}T${formattedTime}` : '';

        const jobResp = await getJobById(iv.job_id);
        const jobData = jobResp.data || {};

        setInterviewData({
          title: iv.notes || '',
          dateTime: dateTimeValue,
          duration: iv.duration || 30,
          location: iv.location || '',
          userEmail: iv.useremail || user?.email || '',
          description: iv.description || '',
          jobId: iv.job_id,
          company: jobData.company || 'Unknown Company',
          position: jobData.position || 'Unknown Position'
        });
      } catch (err) {
        console.error("❌ Error loading interview details:", err);
        setError("Failed to load interview details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, user]);

  const handleChange = (e) => {
    setInterviewData({
      ...interviewData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const localDate = new Date(interviewData.dateTime); 
      const isoString = localDate.toISOString(); 

      await updateInterview(id, {
        ...interviewData,
        dateTime: isoString
      });

      alert('✅ Interview Updated Successfully!');
      navigate('/view-scheduled-interviews');
    } catch (err) {
      console.error("❌ Error updating interview:", err);
      setError('Failed to update interview. Please try again.');
    }
  };

  if (loading) return <p>Loading interview details...</p>;
  if (error) {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
        <h3>Failed to load interview details.</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '500px',
      margin: 'auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>✏️ Edit Interview</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontWeight: 'bold' }}>Company:</label>
        <input
          type="text"
          value={interviewData.company}
          disabled
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#e9ecef'
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Position:</label>
        <input
          type="text"
          value={interviewData.position}
          disabled
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#e9ecef'
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Interview Title:</label>
        <select
          name="title"
          value={interviewData.title}
          onChange={handleChange}
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
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
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Duration (minutes):</label>
        <input
          type="number"
          name="duration"
          value={interviewData.duration}
          onChange={handleChange}
          min="1"
          required
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Location:</label>
        <input
          type="text"
          name="location"
          value={interviewData.location}
          onChange={handleChange}
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Attendee Email:</label>
        <input
          type="email"
          name="userEmail"
          value={interviewData.userEmail}
          onChange={handleChange}
          required
          style={{
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />

        <label style={{ fontWeight: 'bold' }}>Description:</label>
        <textarea
          name="description"
          value={interviewData.description}
          onChange={handleChange}
          style={{
            height: '100px',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#0275d8',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ✅ Update Interview
          </button>

          <button
            type="button"
            onClick={() => navigate('/view-scheduled-interviews')}
            style={{
              backgroundColor: '#d9534f',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInterview;
