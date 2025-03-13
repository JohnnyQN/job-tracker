📌 Job Application Tracker

🚀 A full-stack web app to track job applications, interviews, and follow-ups efficiently.
📖 Table of Contents

    🔍 Overview
    🚀 Features
    💻 Tech Stack
    📦 Installation
    ⚙️ Environment Variables
    ▶️ Running the App
    📡 API Endpoints
    ✅ Testing
    📌 Future Enhancements
    📜 License

🔍 Overview

The Job Application Tracker is a full-stack web application that allows users to:

    Keep track of job applications.
    Store interview details & application status.
    Integrate with Google Calendar API (Upcoming).
    View progress in a pipeline-style dashboard (Upcoming).

🎯 Goal

To streamline and organize job applications effectively, making the job search process more manageable.
🚀 Features

✅ User Authentication (JWT-based)
✅ CRUD Job Applications (Create, Read, Update, Delete)
✅ Application Status Management (Applied, Interviewing, Offer, Rejected)
✅ Secure Routes with Authentication Middleware
✅ Token-Based Authorization for API Requests
✅ PostgreSQL Database Support

🔜 Upcoming Features:

    📊 Analytics Dashboard (Job search trends, interviews, offers).
    📅 Google Calendar API Integration (Interview scheduling & reminders).
    📝 Notes Section (Track interview details).

💻 Tech Stack
Backend

    Node.js with Express.js
    PostgreSQL with pg (Database)
    bcryptjs (Password hashing)
    jsonwebtoken (JWT authentication)

Frontend (Future Work)

    React.js with Material UI (Planned)
    Redux for State Management (Planned)

📦 Installation
1️⃣ Clone the Repository

git clone https://github.com/JohnnyQN/job-tracker.git
cd job-tracker

2️⃣ Install Dependencies

npm install

⚙️ Environment Variables

Create a .env file in the root directory and add:

PORT=5000
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost/job_tracker
JWT_SECRET=your_jwt_secret_key

Replace USERNAME and PASSWORD with your PostgreSQL credentials.
▶️ Running the App
Start the Server

node server.js

or use nodemon for auto-reloading:

npm install -g nodemon
nodemon server.js

📡 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user & get token
📂 Job Management
Method	Endpoint	Description
POST	/api/jobs	Add a new job
GET	/api/jobs	Get all jobs (user-specific)
GET	/api/jobs/:id	Get job by ID
PUT	/api/jobs/:id	Update job details
DELETE	/api/jobs/:id	Delete job entry
✅ Testing

Test the API using Postman or cURL:

curl -X GET http://localhost:5000/api/jobs -H "Authorization: Bearer YOUR_TOKEN"

📌 Future Enhancements

🔹 LinkedIn Job Importer (Auto-fetch job details)
🔹 Resume Matching Feature
🔹 Advanced Filters & Sorting
📜 License

📄 MIT License – Feel free to contribute!
👨‍💻 Author

Johnny [JohnnyQN]
📧 Contact: johnny.q.ngo@gmail.com
📌 GitHub: (https://github.com/JohnnyQN)

🚀 Ready to track your job applications like a pro? Let's go!