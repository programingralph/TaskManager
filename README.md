TaskBrisker: Task Manager App Documentation 
TaskBrisker is a robust, user-friendly task management application built with a React (Vite) frontend, Express backend, and PostgreSQL database. It allows users to register, log in, and manage tasks with titles, descriptions, and due dates. The app features a responsive UI with Tailwind CSS, secure authentication with JWT. Below is the complete documentation for setup, usage, and technical details.

Table of Contents Features 
(#features)
Tech Stack (#tech-stack)
Setup Instructions (#setup-instructions)Prerequisites (#prerequisites)
Backend Setup (#backend-setup)
Frontend Setup (#frontend-setup)
Database Setup (#database-setup)

Usage (#usage)
User Flow (#user-flow)
Routes (#routes)
Components (#components)

API Endpoints (#api-endpoints)
File Structure (#file-structure)
Security Considerations (#security-considerations)

FeaturesUser Authentication: 
Register and log in with secure JWT-based authentication.
Task Management: 
Create, update, and delete tasks with titles, descriptions, and due dates (MM/DD/YYYY or "Not time sensitive").
Responsive UI: Built with Tailwind CSS, featuring a sticky footer, clean forms, and a consistent design across routes.
Dynamic Routing: 
Supports routes for home (/), login (/login), registration (/register), and user-specific task management (/user/:id).
Persistent Data: 
Stores user data and tasks in a PostgreSQL database (userinfo and tasks tables).
Error Handling: 
Displays user-friendly error messages for invalid inputs, authentication failures, and server errors.
Loading States: 
Shows loading spinners during API calls for a smooth UX.

Tech StackFrontend: 
React (Vite), React Router, Tailwind CSS
Backend: 
Node.js, Express, PostgreSQL (pg), bcrypt, jsonwebtoken
Database: 
PostgreSQL with userinfo (users) and tasks (tasks) tables
Ports: 
Frontend (http://localhost:5173), Backend (http://localhost:3000)

Setup InstructionsPrerequisitesNode.js: v16 or higher
PostgreSQL: v13 or higher
Git: For cloning the repository
NPM: For package management
Browser: Chrome, Firefox, or any modern browser

Backend SetupClone the Repository (if applicable):bash

git clone <repository-url>
cd backend

Install Dependencies:bash

npm install express pg bcrypt jsonwebtoken cors dotenv

Configure Environment:Create a .env file in the backend root:env

JWT_SECRET=your_secure_secret

Update config/db.js with your PostgreSQL credentials:javascript

import { Pool } from 'pg';
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});
export default pool;

Start the Backend:bash

node server.js

The server runs on http://localhost:3000.

Frontend SetupNavigate to Frontend Directory:bash

cd frontend

Install Dependencies:bash

npm install

Start the Development Server:bash

npm run dev

The app runs on http://localhost:5173.

Verify Assets:Ensure logo.png and background3.jpg are in the public directory for Vite.

Database SetupCreate Database:sql

CREATE DATABASE brisk;

Create Tables:sql

-- Users table
CREATE TABLE userinfo (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tasks table
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES userinfo(user_id),
    title VARCHAR(255) NOT NULL,
    task_text TEXT NOT NULL,
    due_date VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Test Database Connection:
Use a PostgreSQL client (e.g., pgAdmin) or run:bash

UsageUser FlowHome Page (/):
Displays a welcome message, logo, and links to log in or register.
Footer with copyright and social links (X, GitHub).

Register (/register):
Enter a unique username and password.
On success, redirects to /user/:id with the user’s tasks.

Login (/login):
Enter username and password.
On success, redirects to /user/:id.

Task Management (/user/:id):
Create tasks with title, description, and optional due date.
Update task due dates by clicking the date and selecting a new one.
Delete tasks with a trash icon.
Logout clears the JWT token and redirects to /login.

Error Handling:
Shows alerts for invalid inputs, authentication errors, or server issues.
Displays a loading spinner during API calls.

Routes/: Home page with welcome message and login/register links.
/login: Login form.
/register: Registration form.
/user/:id: Authenticated user’s task management dashboard.
*: 404 page for unmatched routes.

ComponentsHeader:
 Displays the app logo and navigation (used in /).
Footer: 
Sticky footer with logo, copyright, and social links (X, GitHub).
Greeting: 
Welcome message on the home page.
Tasks: Form to create new tasks (/user/:id).
NewTasks: 
Displays individual tasks with read-only title/task and editable due date.
Logout: 
Button to clear JWT and redirect to /login.

API EndpointsAll endpoints are prefixed with http://localhost:3000/api.Method
Endpoint
Description
Request Body
Response
POST
/register
Register a new user
{ username, password }
{ user_id, token } or { error }
POST
/login
Authenticate a user
{ username, password }
{ user_id, token } or { error }
GET
/users/:user_id/tasks
Fetch tasks for a user
None (JWT in Authorization header)
Array of tasks or { error }
POST
/users/:user_id/tasks
Create a new task
{ title, task_text, due_date }
New task object or { error }
PUT
/tasks/:task_id
Update a task’s due date
{ due_date }
Updated task object or { error }
DELETE
/tasks/:task_id
Delete a task
None (JWT in Authorization header)
204 No Content or { error }

Authentication:
Most endpoints require a JWT in the Authorization header: Bearer <token>.
Token is stored in localStorage after login/register.

File Structure

brisk/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Greeting.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── NewTasks.jsx
│   │   │   └── Logout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ActiveUser.jsx
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   │   ├── logo.png
│   │   └── background3.jpg
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore

Security ConsiderationsJWT Secret: Store JWT_SECRET in .env, not in server.js.
Password Hashing: Uses bcrypt for secure password storage.
CORS: Configured to allow http://localhost:5173 only.
Input Validation: Frontend validates task title and description; backend validates task_id and user_id.
Protected Routes: Add a ProtectedRoute component to prevent unauthorized access to /user/:id:jsx

import { Navigate } from 'react-router-dom';
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}
// In App.jsx:
<Route path="/user/:id" element={<ProtectedRoute><ActiveUser /></ProtectedRoute>} />

Remove /users Endpoint: The GET /users endpoint exposes passwords; remove or sanitize it for production.

