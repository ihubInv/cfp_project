# Environment Variables Setup for PRISM Backend

## Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/prism_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## Setup Instructions

1. **Create the .env file**: Copy the above content into a new file named `.env` in the backend directory
2. **Install MongoDB**: Make sure MongoDB is installed and running on your system
3. **Update JWT secrets**: Change the JWT_SECRET and JWT_REFRESH_SECRET to secure random strings
4. **Start the backend**: Run `npm run dev` again

## MongoDB Setup Options

### Option 1: Local MongoDB
- Install MongoDB locally
- Start MongoDB service
- Use: `MONGODB_URI=mongodb://localhost:27017/prism_db`

### Option 2: MongoDB Atlas (Cloud)
- Create a free account at https://cloud.mongodb.com
- Create a cluster and get the connection string
- Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prism_db`

### Option 3: Docker MongoDB
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```
Then use: `MONGODB_URI=mongodb://localhost:27017/prism_db`
