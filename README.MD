# Pro-Tasker

## Description

Pro-Tasker is a full-stack project management application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to create projects, manage tasks within those projects, and track task progress using status categories such as "To Do", "In Progress", and "Done".

Users can securely register, log in, and manage only the data they own. The application demonstrates full CRUD functionality, authentication, and authorization.

---

## Setup & Local Installation

### 1. Clone the Repository

```bash
git clone https://github.com/arichard02/pro-tasker-capstone-project.git
cd pro-tasker-capstone-project
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

The backend will run on:

```
http://localhost:3000
```

Deployed:

Backend: Render https://pro-tasker-backend.onrender.com/api
Frontend: Render https://pro-tasker-capstone-project.netlify.app

---


---


---

## API Endpoints

### Authentication Routes

**POST /api/auth/register**
Registers a new user.

* Request body: `{ username, email, password }`

**POST /api/auth/login**
Logs in a user and returns a token.

* Request body: `{ email, password }`

---

### Project Routes (Protected)

**GET /api/projects**
Returns all projects for the logged-in user.

**POST /api/projects**
Creates a new project.

* Request body: `{ name, description }`

**GET /api/projects/:id**
Returns a single project by ID.

**PUT /api/projects/:id**
Updates a project.

* Request body: `{ name, description }`

**DELETE /api/projects/:id**
Deletes a project.

---

### Task Routes (Protected & Nested)

**GET /api/projects/:projectId/tasks**
Returns all tasks for a specific project.

**POST /api/projects/:projectId/tasks**
Creates a new task in a project.

* Request body: `{ title, description }`

**PUT /api/projects/:projectId/tasks/:taskId**
Updates a task.

* Request body can include: `{ title, description, status }`

**DELETE /api/projects/:projectId/tasks/:taskId**
Deletes a task.

---

## Notes

* All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

* Users can only access and modify their own projects and tasks.

---
