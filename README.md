# SpeakEasy Server

This is the server-side repository for the **SpeakEasy** platform. The server is built with Node.js and Express and integrates with MongoDB to handle data related to users, tutorials, and bookings.

## Features

- Secure user authentication with JWT and cookies.
- Manage tutorials, bookings, and users.
- Real-time review and tutor data aggregation.
- API endpoints to support front-end functionality.

## Tech Stack

- **Node.js**: Server runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database to store user, tutorial, and booking data.
- **JWT**: Token-based authentication.
- **dotenv**: To manage environment variables securely.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- MongoDB (Cloud/Local)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the server directory:

   ```bash
   cd server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and configure the following variables:

   ```env
   USER_USER=<your_mongodb_username>
   USER_PASS=<your_mongodb_password>
   JWT_ACCESS_SECRET=<your_jwt_secret>
   PORT=<your_port>
   ```

5. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST /jwt**: Generate JWT token and set as a cookie.
- **POST /logout**: Clear the JWT cookie to log out.

### Users

- **POST /users**: Create a new user.
- **GET /users/:email**: Retrieve a specific user's details by email.
- **GET /users**: Get the total number of users.

### Tutorials

- **GET /tutors**: Retrieve all tutors or filter by category or search query.
- **GET /tutors/:email**: Retrieve all tutorials of a specific tutor.
- **GET /tutor/:id**: Retrieve details of a specific tutorial by ID.
- **POST /add-tutorials**: Add a new tutorial.
- **PUT /updateTutorial/:id**: Update an existing tutorial by ID.
- **DELETE /delete-tutor/:id**: Delete a tutorial by ID.

### Bookings

- **POST /add-book**: Create a new booking.
- **GET /myBooked/:email**: Retrieve all bookings for a specific user (JWT-protected).
- **PATCH /review/:tutorId**: Increment the review count for a specific tutor.

### Analytics

- **GET /tutorCount**: Get the total number of tutors.
- **GET /reviewsCount**: Get the total number of reviews.

## Middleware

- **CORS**: Configured to allow requests from specific origins.
- **JWT Verification**: Protects sensitive routes by verifying user tokens.

## Usage Notes

- The server interacts with a MongoDB instance using the `mongodb` package.
- It uses environment variables to manage sensitive data.
- Cookies are used to store and manage JWT tokens securely.

## Development

Run the server in development mode:

```bash
npm run dev
```

This will enable hot-reloading for easier development.

## Deployment

Deploy the server to a platform like Heroku, Vercel, or any cloud service supporting Node.js.

Ensure to configure the `NODE_ENV` to `production` and set up environment variables correctly.

---

**Live API Base URL**: [https://language-express-server-a-10.vercel.app](https://language-express-server-a-10.vercel.app)

**Front-End Application**: [https://language--exchange-a-11.web.app](https://language--exchange-a-11.web.app)

---

For any issues or contributions, please raise an issue or submit a pull request.
