# IIT Mandi iHub & HCi Foundation Research Platform - Backend

A comprehensive backend API for managing research projects, publications, equipment, and administrative functions for the IIT Mandi iHub & HCi Foundation Research Platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Project Management**: Complete CRUD operations for research projects
- **Publication Management**: Track and manage research publications
- **Equipment Management**: Inventory management for research equipment
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **File Management**: Secure file upload and management system
- **Activity Logging**: Detailed audit trail for all operations
- **Admin Dashboard**: Administrative functions and user management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd researchproject/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://inventory_db_user:30yslpW9zGYgPBL6@cluster0.taq14l1.mongodb.net/cfp_db
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/             # Route controllers
│   ├── authController.js    # Authentication logic
│   ├── projectController.js # Project management
│   ├── userController.js    # User management
│   ├── analyticsController.js # Analytics and reporting
│   └── ...
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── upload.js           # File upload middleware
├── models/                 # MongoDB models
│   ├── User.js
│   ├── Project.js
│   ├── Publication.js
│   ├── Equipment.js
│   └── ...
├── routes/                 # API routes
│   ├── auth.js
│   ├── projects.js
│   ├── users.js
│   └── ...
├── uploads/                # File upload directory
├── utils/
│   └── jwt.js             # JWT utilities
├── app.js                 # Main application file
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Publications
- `GET /api/publications` - Get all publications
- `POST /api/publications` - Create new publication
- `GET /api/publications/:id` - Get publication by ID
- `PUT /api/publications/:id` - Update publication
- `DELETE /api/publications/:id` - Delete publication

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Add new equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/projects` - Get project analytics
- `GET /api/analytics/funding` - Get funding analytics

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:id` - Download file
- `DELETE /api/files/:id` - Delete file

## 🗄️ Database Models

### User
- Personal information and authentication
- Role-based access control (Admin, PI, User)
- Profile management

### Project
- Research project details
- Funding information
- Timeline and milestones
- Associated publications and outcomes

### Publication
- Research publications
- Citation information
- Associated projects and authors

### Equipment
- Research equipment inventory
- Availability and booking
- Maintenance records

### ActivityLog
- System activity tracking
- User action logging
- Audit trail

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: User provides credentials and receives a JWT token
2. **Authorization**: Include the token in the `Authorization` header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Roles**: 
   - `admin`: Full system access
   - `pi`: Principal Investigator access
   - `user`: Basic user access

## 📊 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `MAX_FILE_SIZE` | Maximum file upload size | 10485760 (10MB) |
| `UPLOAD_PATH` | File upload directory | ./uploads |

## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   JWT_SECRET=<strong-secret-key>
   MONGODB_URI=<production-mongodb-uri>
   ```

2. **Build and Start**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (if available)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data

## 🔧 Development

### Adding New Models

1. Create model file in `models/` directory
2. Define schema with Mongoose
3. Export the model

### Adding New Routes

1. Create route file in `routes/` directory
2. Define endpoints and middleware
3. Import and use in `app.js`

### Adding New Controllers

1. Create controller file in `controllers/` directory
2. Implement business logic
3. Export controller functions

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **JWT Token Issues**
   - Check JWT_SECRET in `.env`
   - Verify token expiration
   - Ensure proper token format

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Ensure proper file types

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Note**: Make sure to update the JWT_SECRET and other sensitive environment variables before deploying to production.
