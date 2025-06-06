# Campus Events Hub 🎓

A modern, full-stack web application for managing and discovering campus events. Built with Node.js, Express, and SQLite, this platform enables seamless event management for both organizers and participants.

![Campus Events Hub](https://via.placeholder.com/800x400?text=Campus+Events+Hub)

## 🌟 Key Features

### User Features
- **Authentication & Authorization**
  - Secure user registration and login
  - JWT-based authentication
  - Role-based access control (User/Organizer)
  - Password hashing and security
  - Session management

- **Event Discovery**
  - Browse all campus events
  - Filter events by category, date, or location
  - Search functionality with real-time results
  - Event recommendations based on interests
  - Calendar view of upcoming events

- **Event Management**
  - Register for events
  - View registered events
  - Cancel registrations
  - Receive event reminders
  - Share events on social media

### Organizer Features
- **Event Creation & Management**
  - Create detailed event listings
  - Upload event images
  - Set event capacity and registration deadlines
  - Manage event categories and tags
  - Track event attendance

- **Analytics Dashboard**
  - View registration statistics
  - Track attendance rates
  - Generate event reports
  - Monitor user engagement
  - Export data for analysis

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Logging**: Winston

### Frontend
- **Framework**: Vanilla JavaScript
- **Styling**: CSS3 with modern features
- **State Management**: Custom event system
- **Build Tools**: npm scripts
- **Development**: Live reload with Nodemon

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/campus-events-hub.git
cd campus-events-hub
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**
Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret
DB_PATH=./database/events.db
NODE_ENV=development
```

## 🏗️ Project Structure

```
campus-events-hub/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── .env            # Environment variables
│   ├── package.json    # Backend dependencies
│   └── server.js       # Main server file
├── frontend/
│   ├── css/            # Stylesheets
│   │   ├── main.css    # Main styles
│   │   └── themes/     # Theme variations
│   ├── js/             # JavaScript files
│   │   ├── auth.js     # Authentication logic
│   │   ├── events.js   # Event management
│   │   └── ui.js       # UI components
│   ├── assets/         # Images and media
│   ├── package.json    # Frontend dependencies
│   └── server.js       # Frontend server
└── README.md
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
The backend server will run on http://localhost:5000

2. **Start Frontend Server**
```bash
cd frontend
npm run dev
```
The frontend server will run on http://localhost:3002

3. **Access the Application**
Open your web browser and navigate to http://localhost:3002

### Production Mode

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Start Production Servers**
```bash
# Start backend
cd backend
npm start

# Start frontend
cd frontend
npm start
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "organizer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Event Endpoints

#### Get All Events
```http
GET /api/events
Query Parameters:
  - category: string
  - date: string (YYYY-MM-DD)
  - location: string
```

#### Create Event (Organizer Only)
```http
POST /api/events
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "date": "string",
  "location": "string",
  "capacity": number,
  "category": "string"
}
```

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER,
  organizer_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id)
);
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :5000
# Kill process
taskkill /F /PID <process_id>
```

2. **Database Connection Issues**
- Ensure SQLite is properly installed
- Check database file permissions
- Verify database path in .env file

3. **Authentication Problems**
- Clear browser cache and cookies
- Verify JWT_SECRET in .env
- Check token expiration

## 🧪 Testing

Run the test suite:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Performance Optimization

- Implemented caching for frequently accessed data
- Optimized database queries
- Minified static assets
- Lazy loading for images
- Compression middleware

## 🔒 Security Measures

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use meaningful variable names
- Write clear comments
- Follow the existing code structure

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- ASLOUNE Yahya - ED-DHIBI Youssef - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by [Project Name]
- Built with [Technology Name]

## 📞 Support

For support, email support@campuseventshub.com or open an issue in the repository. 
