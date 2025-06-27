# EmployeeManage_Server


EmployeeManage_Server is the backend API for the Employee Management System.  
It is built with **Node.js**, **Express**, and **MongoDB** (using Mongoose).  
This server provides RESTful endpoints for managing employees, tasks, authentication, and admin operations.

## Features

- User authentication (signup, login)
- Admin dashboard APIs
- CRUD operations for tasks
- Employee management
- Secure password hashing
- Email notifications (via nodemailer)
- CORS enabled for frontend integration

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Nodemailer
- JWT Authentication
- dotenv for environment variables

## Project Structure

```
src/
  ├── controller/      # Route controllers (User, Task, etc.)
  ├── Module/          # Mongoose schemas/models
  ├── Nodemailer/      # Email sending logic
  ├── routes/          # Express route definitions
  └── index.js         # Main server entry point
```

## Getting Started

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/EmployeeManage_Server.git
   cd EmployeeManage_Server
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root with:
   ```
   PORT=4040
   MongoDBurl=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret
   user=your_email@gmail.com
   pass=your_email_app_password
   ```

4. **Run the server**
   ```
   npm start
   ```

## API Endpoints

- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /createTask` - Create a new task
- `GET /tasks` - Get all tasks
- `PUT /updateTask` - Update a task
- `DELETE /deleteTask/:id` - Delete a task
