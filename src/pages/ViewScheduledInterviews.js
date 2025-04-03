import React, { useState, useEffect, useContext } from 'react';
import { fetchScheduledInterviews, cancelInterview, getJobById } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ViewScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchScheduledInterviews();
        if (Array.isArray(response) && response.length > 0) {
          const withJobs = await Promise.all(
            response.map(async (iv) => {
              let job = {};
              try {
                const jobResp = await getJobById(iv.job_id);
                job = jobResp.data;
              } catch {
                console.warn(`⚠️ Could not load job ID ${iv.job_id}`);
              }
              return { ...iv, job };
            })
          );
          setInterviews(withJobs);
        } else {
          setInterviews([]);
        }
      } catch (err) {
        console.error("❌ Error fetching interviews:", err);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Turn date/time into local string
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "N/A";
    try {
      const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr; // Ensure only YYYY-MM-DD
      const isoString = `${datePart}T${timeStr}`; 
      const dateObj = new Date(isoString);
      return dateObj.toLocaleString("en-US", {
        timeZone: 'America/Los_Angeles',
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting date/time:", e);
      return "Invalid Date";
    }
  };  

  const handleCancel = async (eventId) => {
    if (window.confirm("Cancel this interview?")) {
      try {
        await cancelInterview(eventId);
        alert("🗑 Interview canceled successfully.");
        setInterviews((prev) => prev.filter((iv) => iv.id !== eventId));
      } catch (err) {
        alert("❌ Failed to cancel. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading scheduled interviews...</p>;

  return (
    <div style={{
      padding: '20px',
      maxWidth: '700px',
      margin: 'auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        📅 Scheduled Interviews
      </h1>

      {interviews.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'red' }}>
          ⚠️ No scheduled interviews found.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {interviews.map((iv) => (
            <li key={iv.id} style={{
              padding: '15px',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <strong>Company:</strong> {iv.job?.company || "Unknown Company"}
              <br />
              <strong>Position:</strong> {iv.job?.position || "Unknown Position"}
              <br />
              <strong>Interview Title:</strong> {iv.notes || "Untitled Interview"}
              <br />
              <strong>Date & Time:</strong> {formatDateTime(iv.date, iv.time)}
              <br />
              <strong>Duration (minutes):</strong> {iv.duration || "N/A"}
              <br />
              <strong>Location:</strong> {iv.location || "Not Provided"}
              <br />
              <strong>Attendee Email:</strong> {iv.userEmail || iv.useremail || "Not Provided"}
              <br />
              <strong>Description:</strong> {iv.description || "No Description"}
              <br />

              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => navigate(`/edit-interview/${iv.id}`)}
                  style={{
                    backgroundColor: '#0275d8',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px'
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleCancel(iv.id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px'
                  }}
                >
                  🗑 Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#5cb85c',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          🔄 Refresh Interviews
        </button>
      </div>
    </div>
  );
};

export default ViewScheduledInterviews;
