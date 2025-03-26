📌 Job Application Tracker

A full-stack web application to track job applications, interviews, and follow-ups — built with Node.js, Express, PostgreSQL, and React.

🚀 Features

✅ User Authentication (JWT-based)

✅ CRUD Job Applications (Create, Read, Update, Delete)

✅ Interview Scheduling & Notes

✅ Token-Based Auth Middleware

✅ PostgreSQL Integration

✅ Fully Tested API Endpoints

🔜 Upcoming:

📊 Analytics Dashboard

🗕️ Google Calendar API Integration

📝 Resume Matching & Job Import

🧰 Tech Stack

Backend:

Node.js + Express.js

PostgreSQL (pg)

JWT + bcryptjs

Sequelize ORM

Frontend:

React (via Create React App)

React Router DOM

Material UI (Planned)

Redux (Planned)

🗂 Project Structure

job-tracker/
├── client/                # React frontend
│   └── README.md          # CRA default readme (optional)
├── server/                # Express backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── ...
├── tests/                 # Jest + Supertest files
├── migrations/            # SQL schema
├── db.js                  # PG database connection
├── server.js              # App entry point
├── README.md              # ← YOU ARE HERE
└── .env                   # Environment variables

📦 Installation

git clone https://github.com/JohnnyQN/job-tracker.git
cd job-tracker
npm install

⚙️ Environment Setup

Create a .env file at the root with:

PORT=5000
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost/job_tracker
JWT_SECRET=your_jwt_secret_key

▶️ Running the App

👥 Backend

node server.js

or with hot-reloading:

npm install -g nodemon
nodemon server.js

🌐 Frontend (if configured)

cd client
npm install
npm start

Open http://localhost:3000

🧪 Testing

Run all tests with:

npm test

Tests include:

User registration & login
Job CRUD functionality
Interview scheduling

📡 API Endpoints

🔐 Authentication

Method	    Endpoint	        Description
POST	    /api/auth/register	Register a new user
POST	    /api/auth/login	    Login user & get token


📂 Jobs

Method	    Endpoint	        Description
POST	    /api/jobs	        Add new job
GET	        /api/jobs	        Get user jobs
GET	        /api/jobs/:id	    Get job by ID
PUT	        /api/jobs/:id	    Update job
DELETE	    /api/jobs/:id	    Delete job


🗓️ Interviews

Method	Endpoint	            Description
POST	/api/calendar/schedule	Schedule an interview


📌 Future Enhancements

🔹 LinkedIn/Job Board Integrations
🔹 Resume Matching via OpenAI API
🔹 Timeline View for Applications
🔹 Role-based User Permissions

👨‍💼 Author

Johnny [JohnnyQN]
📧 Email: johnny.q.ngo@gmail.com🔗 GitHub: github.com/JohnnyQN

📜 License
MIT License – feel free to fork or contribute!

🚀 Ready to track your job applications like a pro? Let’s go!
