# IIT Mandi iHub Research Platform - React Application

This is the frontend application for the IIT Mandi iHub & HCi Foundation Research Platform built with React.

## Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── index.html             # Main HTML template
│   ├── manifest.json          # PWA manifest
│   └── placeholder-*.png      # Placeholder images
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── admin/             # Admin-specific components
│   │   │   ├── AdminLayout.jsx
│   │   │   └── FileManager.jsx
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SessionManager.jsx
│   │   ├── charts/            # Chart components
│   │   │   ├── CustomTooltip.jsx
│   │   │   ├── FundingChart.jsx
│   │   │   ├── ProjectDistributionChart.jsx
│   │   │   └── TrendChart.jsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── ui/                # Base UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── file-upload.jsx
│   │       └── input.jsx
│   ├── pages/                 # Page components
│   │   ├── admin/             # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── ProjectManagement.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── EquipmentPage.jsx
│   │   ├── FundingDashboard.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProjectDetailPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   └── PublicationsPage.jsx
│   ├── store/                 # Redux store
│   │   ├── api/               # API slices
│   │   │   ├── adminApi.js
│   │   │   ├── apiSlice.js
│   │   │   ├── authApi.js
│   │   │   ├── equipmentApi.js
│   │   │   ├── fileApi.js
│   │   │   ├── outcomeApi.js
│   │   │   ├── publicApi.js
│   │   │   └── publicationApi.js
│   │   ├── slices/            # Redux slices
│   │   │   └── authSlice.js
│   │   └── store.js           # Store configuration
│   ├── styles/                # Stylesheets
│   │   └── globals.css        # Global styles
│   ├── utils/                 # Utility functions
│   │   └── authInterceptor.js
│   ├── lib/                   # Library utilities
│   │   └── utils.js           # Common utilities
│   ├── assets/                # Static assets (images, etc.)
│   ├── App.jsx                # Main App component
│   └── index.js               # Entry point
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── components.json            # shadcn/ui configuration
```

## Key Features

- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **RTK Query** for API calls and caching
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Recharts** for data visualization
- **JWT Authentication** with refresh tokens

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Component Organization

- **Pages**: Top-level route components
- **Components**: Reusable UI components organized by feature
- **UI**: Base UI components (buttons, inputs, etc.)
- **Store**: Redux store configuration and API slices
- **Utils**: Helper functions and utilities
- **Styles**: Global styles and CSS files

## Authentication

The app uses JWT-based authentication with:
- Access tokens (1 hour expiry)
- Refresh tokens (7 days expiry)
- Automatic token refresh
- Role-based access control (Public, Validator, Admin)

## API Integration

- **RTK Query** for efficient data fetching and caching
- **Automatic retries** and error handling
- **Optimistic updates** for better UX
- **Background refetching** for fresh data
