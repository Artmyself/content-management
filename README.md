Artist Management System
A full-stack administrative panel designed to manage artist records, their music collections, and system users with Role-Based Access Control (RBAC).
🚀 Tech Stack
Backend: Node.js (ESM), Express, Neon Postgres (Raw SQL), Arcjet (Security), JWT.
Frontend: React 19 (Vite), Tailwind CSS v4, Lucide React, Axios.
Database: PostgreSQL (Neon Serverless).


🛠️ Installation & Setup
1. Prerequisites
Node.js (v20 or higher)
NPM (v10 or higher)
A Neon.tech database account


3. Backend Setup
Navigate to the backend directory and install dependencies:
code
Bash
cd backend
npm install
Environment Variables:
Create a .env file in the backend/ folder:
code
Env
PORT=3000
PGHOST='your-neon-host'
PGDATABASE='neondb'
PGUSER='neondb_owner'
PGPASSWORD='your-password'
ARCJET_KEY='your-arcjet-key'
JWT_SECRET='your-secure-random-string'
Database Initialization:

Run the SQL scripts provided in the project documentation within your Neon SQL Editor to create the "user", artist, and music tables. Important: Always wrap the "user" table in double quotes in your queries.
Run Backend:
code
Bash
npm run dev
Port: Runs on http://localhost:3000

5. Frontend Setup
Navigate to the frontend directory and install dependencies:
code
Bash
cd frontend
npm install
Tailwind CSS v4 Setup:
Ensure your src/index.css contains:
code
CSS
@import "tailwindcss";
Run Frontend:
code
Bash
npm run dev
Port: Runs on http://localhost:5173 (Default Vite port)
