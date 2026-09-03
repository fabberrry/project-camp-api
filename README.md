# Project Camp API

A RESTful backend API for a collaborative project management system built with Node.js, Express.js, MongoDB, and Mongoose.

Project Camp provides APIs for user authentication, project management, team collaboration, tasks, subtasks, and project notes.

> **Status:** Under active development

---

## Features

### Authentication

* User registration
* Email verification
* Login and logout
* JWT access and refresh tokens
* Refresh token rotation
* Change password
* Forgot and reset password
* Secure temporary verification tokens
* Protected routes

### Project Management

* Create and manage projects
* Update project information
* Delete projects
* Add and remove project members
* Assign roles to project members
* Role-based access control

### Task Management

* Create, update, and delete tasks
* Assign tasks to project members
* Track task status
* Create and manage subtasks
* Track subtask completion
* File attachments

### Project Notes

* Create project notes
* View notes
* Update notes
* Delete notes

### Health Check

A health-check endpoint is provided for deployment platforms and monitoring services to verify that the API is running correctly.

---

## Tech Stack

| Technology     | Purpose                                |
| -------------- | -------------------------------------- |
| Node.js        | JavaScript runtime                     |
| Express.js     | REST API framework                     |
| MongoDB        | Database                               |
| Mongoose       | MongoDB ODM                            |
| JSON Web Token | Authentication                         |
| Nodemailer     | Email delivery                         |
| Mailgen        | Email template generation              |
| Node Crypto    | Temporary token generation and hashing |
| CORS           | Cross-origin request handling          |
| dotenv         | Environment variable management        |
| Nodemon        | Development server                     |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git
* MongoDB locally or a MongoDB Atlas database

### Clone the repository

```bash
git clone https://github.com/fabberrry/project-camp-api.git
cd project-camp-api
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRATION=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRATION=7d

MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USERNAME=your_mail_username
MAIL_PASSWORD=your_mail_password

CORS_ORIGIN=*
```

Do not commit `.env` or any real credentials to the repository.

### Start the development server

```bash
npm run dev
```

Or run normally:

```bash
npm start
```

---

## API Base URL

Local development:

```text
http://localhost:8000/api/v1
```

---

## API Endpoints

### Authentication

Base route:

```text
/api/v1/auth
```

| Method | Endpoint                           | Description                  | Protected |
| ------ | ---------------------------------- | ---------------------------- | --------- |
| `POST` | `/register`                        | Register a new user          | No        |
| `POST` | `/login`                           | Authenticate a user          | No        |
| `POST` | `/logout`                          | Logout current user          | Yes       |
| `GET`  | `/current-user`                    | Get current user information | Yes       |
| `POST` | `/change-password`                 | Change current password      | Yes       |
| `POST` | `/refresh-token`                   | Generate a new access token  | No        |
| `GET`  | `/verify-email/:verificationToken` | Verify email address         | No        |
| `POST` | `/forgot-password`                 | Request password reset       | No        |
| `POST` | `/reset-password/:resetToken`      | Reset forgotten password     | No        |
| `POST` | `/resend-email-verification`       | Resend verification email    | Yes       |

### Projects

Base route:

```text
/api/v1/projects
```

| Method   | Endpoint                      | Description          |
| -------- | ----------------------------- | -------------------- |
| `GET`    | `/`                           | Get user's projects  |
| `POST`   | `/`                           | Create a project     |
| `GET`    | `/:projectId`                 | Get project details  |
| `PUT`    | `/:projectId`                 | Update a project     |
| `DELETE` | `/:projectId`                 | Delete a project     |
| `GET`    | `/:projectId/members`         | Get project members  |
| `POST`   | `/:projectId/members`         | Add a project member |
| `PUT`    | `/:projectId/members/:userId` | Update member role   |
| `DELETE` | `/:projectId/members/:userId` | Remove a member      |

### Tasks and Subtasks

Base route:

```text
/api/v1/tasks
```

| Method   | Endpoint                         | Description       |
| -------- | -------------------------------- | ----------------- |
| `GET`    | `/:projectId`                    | Get project tasks |
| `POST`   | `/:projectId`                    | Create a task     |
| `GET`    | `/:projectId/t/:taskId`          | Get task details  |
| `PUT`    | `/:projectId/t/:taskId`          | Update a task     |
| `DELETE` | `/:projectId/t/:taskId`          | Delete a task     |
| `POST`   | `/:projectId/t/:taskId/subtasks` | Create a subtask  |
| `PUT`    | `/:projectId/st/:subTaskId`      | Update a subtask  |
| `DELETE` | `/:projectId/st/:subTaskId`      | Delete a subtask  |

### Notes

Base route:

```text
/api/v1/notes
```

| Method   | Endpoint                | Description       |
| -------- | ----------------------- | ----------------- |
| `GET`    | `/:projectId`           | Get project notes |
| `POST`   | `/:projectId`           | Create a note     |
| `GET`    | `/:projectId/n/:noteId` | Get a note        |
| `PUT`    | `/:projectId/n/:noteId` | Update a note     |
| `DELETE` | `/:projectId/n/:noteId` | Delete a note     |

### Health Check

```http
GET /api/v1/healthcheck/
```

Used to check whether the API and server are running correctly.

---

## Authentication

Project Camp uses JWT-based authentication with access and refresh tokens.

### Access Token

The access token is short-lived and is used to access protected API endpoints.

### Refresh Token

The refresh token is longer-lived and can be used to obtain a new access token without requiring the user to log in again.

Basic authentication flow:

```text
Login
  |
  v
Verify credentials
  |
  v
Generate Access Token + Refresh Token
  |
  +----> Access Token ----> Protected API requests
  |
  +----> Refresh Token ---> Generate new access tokens
```

---

## Email Verification

When a new user registers, a temporary verification token is generated.

The original token is sent to the user's email while its SHA-256 hash is stored in the database.

```text
User registers
      |
      v
Generate random token
      |
      +----> Original token ----> Verification email
      |
      +----> SHA-256 hash ------> Database
```

When the verification link is opened:

```text
Token received from URL
        |
        v
Hash received token
        |
        v
Compare with hash stored in database
        |
        v
Check token expiry
        |
        v
Verify email
```

The original verification token is never stored directly in the database.

The same temporary-token mechanism can also be used for password-reset functionality.

---

## Roles and Permissions

Project Camp uses role-based access control for project operations.

The main roles are:

* Admin
* Project Admin
* Member

| Permission                 | Admin | Project Admin | Member |
| -------------------------- | :---: | :-----------: | :----: |
| Create Project             |  Yes  |       No      |   No   |
| Update/Delete Project      |  Yes  |       No      |   No   |
| Manage Members             |  Yes  |       No      |   No   |
| Create/Update/Delete Tasks |  Yes  |      Yes      |   No   |
| View Tasks                 |  Yes  |      Yes      |   Yes  |
| Update Subtask Status      |  Yes  |      Yes      |   Yes  |
| Create/Delete Subtasks     |  Yes  |      Yes      |   No   |
| Manage Notes               |  Yes  |       No      |   No   |
| View Notes                 |  Yes  |      Yes      |   Yes  |

---

## Task Status

Tasks can have the following states:

```text
todo
in_progress
done
```

---

## API Architecture

Requests generally follow this flow:

```text
Client
  |
  v
Route
  |
  v
Middleware
  |
  v
Controller
  |
  v
Mongoose Model
  |
  v
MongoDB
  |
  v
API Response
  |
  v
Client
```

### Routes

Routes define the API path and HTTP method.

Example:

```js
router.route("/register").post(registerUser);
```

### Controllers

Controllers contain the request-handling and business logic.

For example, the registration controller is responsible for:

1. Reading registration data from the request.
2. Validating the data.
3. Checking whether the user already exists.
4. Creating the user.
5. Generating an email verification token.
6. Sending the verification email.
7. Returning a safe API response.

### Models

Mongoose models define how application data is stored in MongoDB.

Model methods are also used for functionality such as:

* Password hashing
* Password comparison
* Access token generation
* Refresh token generation
* Temporary token generation

### Utilities

Reusable utilities handle common functionality such as:

* API errors
* Standard API responses
* Async controller error handling
* Email generation and delivery

---

## Security

The API is being designed with the following security practices:

* Password hashing before storage
* JWT-based authentication
* Short-lived access tokens
* Refresh token management
* Hashed email verification tokens
* Hashed password-reset tokens
* Expiring temporary tokens
* Protected API routes
* Role-based authorization
* Request validation
* CORS configuration
* Sensitive fields excluded from API responses

Passwords, refresh tokens, verification token hashes, reset token hashes, and other sensitive information should never be returned in public API responses.

---


## API Testing

The API can be tested with Postman, Bruno, Insomnia, Thunder Client, or cURL.

Example registration request:

```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "your-secure-password"
}
```

---

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit the changes.

```bash
git commit -m "feat: add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature
```

6. Open a pull request.

---

## Product Requirements

The planned features, API specification, roles, permissions, and requirements are documented in `PRD.md`.

---

## Author

**fabberrry**

GitHub: `@fabberrry`

---

## License

This project currently uses the ISC License as specified in `package.json`.
