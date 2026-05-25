# 🎫 Event Management System

An enterprise-grade, highly scalable backend REST API for an Event Management System. Built with Node.js, Express, MongoDB, and JWT authentication. Features a clean MVC architecture, cluster mode, rate limiting, and comprehensive validation.

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack & Environment](#-tech-stack--environment)
- [Architecture & Folder Structure](#️-architecture--folder-structure)
- [Getting Started & Usage](#-getting-started--usage)
  - [Prerequisites](#1-️-prerequisites)
  - [Environment Variables](#2--environment-variables)
  - [Clone the Repository](#3--clone-the-repository)
  - [Installation & Execution](#4-️-installation--execution)
  - [Available Scripts](#5-️-available-scripts)
- [API Reference](#-api-reference)
- [Authentication & RBAC](#-authentication--rbac)
- [Error Handling Pattern](#-error-handling-pattern)
- [Author](#-author)

## 💡 About the Project

This project is a production-style backend for an event management platform built with **Node.js**, **Express**, **MongoDB**, and **JWT-based authentication**. It provides a clean **MVC-style architecture** for managing users, events, and attendee registrations while keeping the codebase modular, secure, and easy to extend.

The API supports secure user registration and login, role-based access control for admins and users, event creation and management, ticket registration workflows, and centralized error handling. It also includes enterprise-facing safeguards such as **rate limiting**, **Helmet security headers**, **CORS**, **input validation**, and **cluster-based startup** for better scalability.

Designed as a reusable backend foundation, it can be extended for booking flows, payment integrations, notifications, analytics, and admin dashboards without changing the core structure.

## ✨ Key Features

- 🔐 **JWT Authentication** - Secure user authentication with JSON Web Tokens, stored in cookies and also returned in the response payload
- 👥 **Role-Based Access Control (RBAC)** - Admin and user roles with different permissions
- 📅 **Event Management** - Create, read, update, and delete events
- 🎟️ **Attendee Registration** - Users can register for events with ticket types
- 🔄 **Cluster Mode** - Utilizes all CPU cores for improved performance
- 🛡️ **Security Features** - Helmet, CORS, rate limiting, and password hashing
- ✅ **Data Validation** - Zod schemas for request validation
- 📊 **MVC Architecture** - Clean separation of concerns
- 📝 **Error Handling** - Centralized error handling mechanism

## 🧰 Tech Stack & Environment

| Category           | Technologies                               |
| ------------------ | ------------------------------------------ |
| **Runtime**        | Node.js (ES Modules)                       |
| **Framework**      | Express.js 5.x                             |
| **Database**       | MongoDB with Mongoose ODM                  |
| **Authentication** | JSON Web Tokens (JWT)                      |
| **Security**       | bcryptjs, Helmet, CORS, express-rate-limit |
| **Validation**     | Zod                                        |
| **Configuration**  | dotenv                                     |
| **Development**    | nodemon                                    |

## 🏗️ Architecture & Folder Structure

```text
event-management-system/
├── config/
│   ├── db.js                  # MongoDB connection configuration
│   └── env.js                 # Environment variables validation
├── src/
│   ├── middlewares/           # Global Express middlewares
│   │   ├── authMiddleware.js
│   │   ├── cleanEmptyStrings.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── modules/               # Feature-based domain modules
│   │   ├── auth/              # Auth domain (routes, controllers, etc.)
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   ├── events/            # Events domain
│   │   │   ├── attendee.model.js
│   │   │   ├── event.controller.js
│   │   │   ├── event.model.js
│   │   │   ├── event.routes.js
│   │   │   └── event.validation.js
│   │   └── users/             # Users domain
│   │       ├── user.controller.js
│   │       ├── user.model.js
│   │       ├── user.routes.js
│   │       └── user.validation.js
│   ├── utils/                 # Global utility functions
│   │   └── AppError.js
│   └── app.js                 # Express app configuration
├── .env.example               # Example environment variables
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── server.js                  # Entry point with cluster mode
```

## 🚀 Getting Started & Usage

### 1. 🛠️ Prerequisites

To run this project locally, you will need:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Server or Atlas Cloud)
- [Postman](https://www.postman.com/downloads/) or similar API client (recommended)

### 2. 🔐 Environment Variables

Create a `.env` file in the root directory and copy the contents from `.env.example`:

```env
NODE_ENV = development
PORT = 3000
MONGO_URI = mongodb://localhost:27017/event_management_system
JWT_SECRET_KEY = your-super-secret-jwt-key-here
JWT_EXPIRE = 30d
```

#### Variable Notes

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET_KEY`: secret used to sign and verify JWTs
- `JWT_EXPIRE`: token lifetime (for example `30d`)

### 3. 📥 Clone the Repository

```bash
git clone https://github.com/anandprakash01/event-management-system.git
cd event-management-system
```

### 4. ⚙️ Installation & Execution

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

The app starts on the port defined in `.env` (default `http://localhost:3000`).

### 5. ▶️ Available Scripts

```json
{
  "dev": "nodemon server.js",
  "start": "node server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

| Script        | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| `npm run dev` | Starts the server in development mode with nodemon (auto-reloads on file changes) |
| `npm start`   | Starts the server in production mode                                              |
| `npm test`    | Runs tests (currently placeholder)                                                |

## 📡 API Reference

Base URL: `http://localhost:3000/api/v1`

### Authentication Endpoints

| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| POST   | `/auth/register` | Register a new user | No            |
| POST   | `/auth/login`    | Login user          | No            |
| POST   | `/auth/logout`   | Logout user         | Yes           |

### User Endpoints

| Method | Endpoint         | Description              | Auth Required |
| ------ | ---------------- | ------------------------ | ------------- |
| GET    | `/users/profile` | Get current user profile | Yes           |

### Event Endpoints

| Method | Endpoint               | Description                  | Auth Required | Role            |
| ------ | ---------------------- | ---------------------------- | ------------- | --------------- |
| GET    | `/events`              | Get all events               | No            | -               |
| GET    | `/events/:id`          | Get event by ID              | No            | -               |
| POST   | `/events`              | Create a new event           | Yes           | Admin           |
| PATCH  | `/events/:id`          | Update an event              | Yes           | Admin/Organizer |
| DELETE | `/events/:id`          | Delete an event              | Yes           | Admin/Organizer |
| POST   | `/events/:id/register` | Register for an event        | Yes           | User            |
| GET    | `/events/my-tickets`   | Get user's registered events | Yes           | User            |

### Notes

- Event updates and deletions are protected so only the original organizer can modify or remove the event.
- Event creation is restricted to `admin` users.
- Registration is limited by `capacity` and `attendeesCount` to avoid overselling.

### Events Payload Example

**POST** `/api/v1/events`

```json
{
  "title": "Annual Tech Conference",
  "description": "A gathering of software architects.",
  "date": "2026-10-31T14:30:00.000Z",
  "location": "Delhi, India",
  "category": "Conference",
  "capacity": 500
}
```

## 🔒 Authentication & RBAC

### JWT Flow

1. **Register** - Create a new user account with email and password (password is hashed with bcryptjs)
2. **Login** - Authenticate with email and password to receive a JWT token
3. **Access Protected Routes** - Include the JWT token in the Authorization header or as a cookie

### Roles

- **User** - Can browse events, register for events, and view their tickets
- **Admin** - Has all user permissions plus can create, update, and delete events

## 🧠 Error Handling Pattern

The project uses a centralized error handling pattern in `src/middlewares/errorHandler.js`:

1. **AppError Class** - Custom error class that extends JavaScript's native Error
2. **Global Error Handler** - Middleware that catches all errors and sends appropriate responses
3. **Validation Errors** - Handled by Zod and validate middleware
4. **Async Errors** - Automatically caught and passed to the error handler

### Response format

```json
{
  "success": false,
  "message": "Something went wrong",
  "stack": "optional stack trace in development"
}
```

## 👤 Author

- **Anand Prakash**
- GitHub: [@anandprakash01](https://github.com/anandprakash01)
