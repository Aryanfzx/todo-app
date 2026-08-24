# Full-Stack Task Manager API

This repository contains the integrated frontend and backend code for a production-ready Task Management application featuring JWT authentication and full CRUD capabilities.

## Database & Configuration Proof

### 1. Environment Variables (.env)
To boot up the server and validate the token keys, you must create a `.env` file in the `/backend` directory with the following variables:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here

*(Note: Replace the `MONGO_URI` with your actual MongoDB connection string and provide a strong `JWT_SECRET` string.)*

### 2. Database Initialization
The application uses MongoDB (via Mongoose) for state persistence. 
1. Ensure your MongoDB cluster is running and your IP address is whitelisted in your MongoDB Atlas settings.
2. Navigate to the `/backend` directory and run `npm install`.
3. Start the server using `node server.js`.
4. A successful initialization will log `Connected to MongoDB Database` in the terminal, confirming the database connection proof.

### 3. Running the Frontend
1. Navigate to the `/frontend` directory.
2. Run `npm install` to install React dependencies.
3. Run `npm run dev` to start the Vite development server.