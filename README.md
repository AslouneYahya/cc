# Campus Events Hub

A web application for managing and discovering campus events, built with Node.js, Express, and SQLite.

## Features

- User Authentication (Register/Login)
- Role-based Access Control (Users/Organizers)
- Event Management
  - Create, Read, Update, Delete events
  - Event details including title, description, date, location
  - Event categories and tags
- User Dashboard
  - View registered events
  - Manage event registrations
- Organizer Dashboard
  - Create and manage events
  - View event registrations
  - Track event attendance

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Project Structure

```
campus-events-hub/
├── backend/           # Backend server
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Main server file
├── frontend/         # Frontend application
│   ├── css/         # Stylesheets
│   ├── js/          # JavaScript files
│   └── server.js    # Frontend server
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campus-events-hub
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend server will run on http://localhost:5000

2. Start the frontend server:
```bash
cd frontend
npm run dev
```
The frontend server will run on http://localhost:3002

3. Open your web browser and navigate to http://localhost:3002

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user info

### Events
- GET /api/events - Get all events
- GET /api/events/:id - Get event by ID
- POST /api/events - Create new event (Organizer only)
- PUT /api/events/:id - Update event (Organizer only)
- DELETE /api/events/:id - Delete event (Organizer only)

### User Events
- GET /api/user/events - Get user's registered events
- POST /api/user/events/:id - Register for an event
- DELETE /api/user/events/:id - Unregister from an event

## Database

The application uses SQLite as its database. The database file is automatically created when you first run the application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 