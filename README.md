# Event Management System

A modular backend API for event management built with Node.js, Express, MongoDB, and JWT authentication. This repository demonstrates a clean MVC-style architecture with middleware, validation, and logging support for real-world event and user workflows.

---

# Table of contents

- [🛠️ Tech Stack \& Environment](#️-tech-stack--environment)
- [🏗️ The Architectural Journey](#️-the-architectural-journey)
- [📚 Curriculum \& Directory Structure](#-curriculum--directory-structure)
- [🚀 Getting Started \& Usage](#-getting-started--usage)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone the Repository](#2-clone-the-repository)
  - [Module Execution](#module-execution)
- [📖 Additional Resources](#-additional-resources)
- [👤 Author](#-author)

---

## 🛠️ Tech Stack & Environment

- Node.js
- Express.js
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcrypt for password hashing
- dotenv for configuration
- winston for logging
- nodemon for local development

---

## 🏗️ The Architectural Journey

This project is designed as a backend event management system that separates concerns across controllers, routes, models, middleware, and validations. The architecture keeps business logic isolated from request handling, which makes the codebase easier to maintain and extend.

Key architectural concepts:

- Controller-driven request flow
- Route-based API organization
- Mongoose models for domain entities
- Authentication middleware for protected endpoints
- Validation utilities to enforce request payload shape
- Logging utilities for server diagnostics

## 📚 Curriculum & Directory Structure

This repository can be understood as a learning path for backend development.

---

## 🚀 Getting Started & Usage

### 1. Prerequisites

To run these modules locally, you will need the following installed:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Community Server or an active Atlas Cloud connection string)
- [Visual Studio Code](https://code.visualstudio.com/) (Recommended IDE)
- [Postman](https://www.postman.com/downloads/) (Highly recommended for testing API responses)

### 2. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/anandprakash01/learning-nodejs.git

cd learning-nodejs
```

### 3. Module Execution

#### Step 1: Start the Server

If you are using VS Code, you can open the project and run these commands directly inside the integrated terminal ( Ctrl + ` ).

```bash
# Navigate to the specific module
cd 01_nodejs

# Install dependencies
npm install

# Run in development mode (auto-restarts with nodemon)
npm run dev

# Or run production mode
npm start
```

---

#### Step 2: Test the API Responses (Modules 2 & 3)

Once your Express server or Distributed backend is running, you will need an API client to interact with the endpoints.

1. Open **Postman** (or Insomnia / Thunder Client).
2. Create a new HTTP request (`GET`, `POST`, `PUT`, `DELETE`).
3. Enter the local server URL (e.g., `http://localhost:3000/api/v1/users`).
4. Add any necessary JSON bodies or Auth headers in the request configuration.
5. Hit **Send** to view the structured JSON response, inspect network headers, and test your error boundaries!

---

## 📖 Additional Resources

- Express.js documentation: https://expressjs.com/
- Mongoose documentation: https://mongoosejs.com/
- JSON Web Token guide: https://jwt.io/
- bcrypt documentation: https://www.npmjs.com/package/bcrypt

## 👤 Author

**Anand Prakash**

- **GitHub:** [@anandprakash01](https://github.com/anandprakash01)

_Continuously evolving as I explore the deeper layers of backend architecture._
