# Research Project Management Portal

A comprehensive research project management platform designed to streamline the management of research projects, Principal Investigators (PIs), funding schemes, and research outcomes.

## 🚀 Features

### Core Functionality
- **Project Management**: Complete lifecycle management of research projects
- **PI Tracking**: Principal Investigator management and project assignment
- **Funding Management**: Multiple funding schemes and budget tracking
- **Analytics Dashboard**: Comprehensive reporting and analytics
- **User Management**: Role-based access control (Admin, PI, Public)
- **File Management**: Document upload and management system
- **Activity Logging**: Complete audit trail of system activities

### User Roles
- **Admin**: Full system access, user management, analytics
- **Principal Investigator (PI)**: Project management, team coordination
- **Public**: View-only access to published projects and information

## 🛠️ Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh token mechanism
- **File Upload**: Multer for handling file uploads
- **Security**: Helmet, CORS, bcryptjs for password hashing
- **Logging**: Morgan for HTTP request logging

### Frontend
- **Framework**: React 19.1.1 with React Router
- **State Management**: Redux Toolkit with RTK Query
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database_name
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_database_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Note**: Replace all placeholder values with your actual configuration values.

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 5. Database Setup

```bash
# From backend directory
npm run seed  # Optional: Seed initial data
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**:
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**:
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

### Production Mode

1. **Build the Frontend**:
```bash
cd frontend
npm run build
```

2. **Start the Backend**:
```bash
cd backend
npm start
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Project Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects | Yes |
| POST | `/api/projects` | Create new project | Admin |
| GET | `/api/projects/:id` | Get project by ID | Yes |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |

### PI Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/pi-projects` | Get PI projects | Yes |
| POST | `/api/pi-projects` | Create PI project | Admin |
| PUT | `/api/pi-projects/:id` | Update PI project | Admin |
| DELETE | `/api/pi-projects/:id` | Delete PI project | Admin |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/dashboard` | Get dashboard analytics | Admin |
| GET | `/api/analytics/projects` | Get project analytics | Admin |
| GET | `/api/analytics/funding` | Get funding analytics | Admin |

### Public Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/public/projects` | Get public projects | No |
| GET | `/api/public/projects/:id` | Get public project details | No |
| GET | `/api/public/statistics` | Get public statistics | No |

## 🗄️ Database Schema

### Core Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin, pi, public),
  isActive: Boolean,
  lastLogin: Date
}
```

#### Project Model
```javascript
{
  title: String,
  description: String,
  category: ObjectId,
  scheme: ObjectId,
  pi: ObjectId,
  startDate: Date,
  endDate: Date,
  budget: Number,
  status: String,
  files: [String]
}
```

#### PIProject Model
```javascript
{
  project: ObjectId,
  pi: ObjectId,
  role: String,
  startDate: Date,
  endDate: Date,
  status: String
}
```

## 🔧 Configuration

### Backend Configuration

The application uses environment variables for configuration. Key settings include:

- **Database**: MongoDB connection string
- **JWT**: Secret keys for token generation
- **File Upload**: Maximum file size and upload directory
- **CORS**: Allowed origins for cross-origin requests

### Frontend Configuration

The frontend is configured through:

- **API Base URL**: Configured in Redux store
- **Routing**: React Router configuration
- **Theme**: Tailwind CSS configuration
- **Components**: Radix UI component library

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**:
   - Set production environment variables
   - Configure MongoDB Atlas or production database
   - Set up file storage (local or cloud)

2. **Deploy to Platform**:
   ```bash
   # Example for Heroku
   heroku create your-app-name
   git push heroku main
   ```

### Frontend Deployment

1. **Build for Production**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Static Hosting**:
   - Upload `build` folder to your hosting provider
   - Configure environment variables for API endpoints

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
your-repository-name/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── utils/       # Utility functions
│   │   └── styles/      # CSS styles
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Research Platform Development

## 📞 Support

For support and questions, please contact:
- **Email**: your-support-email@example.com
- **Website**: [Your Organization Website](https://your-website.com)

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - Project management system
  - PI tracking and management
  - Analytics dashboard
  - User authentication and authorization
  - File management system

## 🎯 Roadmap

- [ ] Advanced reporting features
- [ ] Integration with external funding databases
- [ ] Mobile application
- [ ] Advanced analytics and AI insights
- [ ] Multi-language support
- [ ] API rate limiting and advanced security

---

**Built with ❤️ for the Research Community**
