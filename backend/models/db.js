const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Create SQLite database
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'organizer'))
  )`);

  // Events table
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
});

// Add some sample data if events table is empty
db.get('SELECT COUNT(*) as count FROM events', (err, row) => {
  if (!err && row.count === 0) {
    const sampleEvents = [
      {
        title: 'Campus Tech Fair',
        description: 'Annual technology showcase featuring student projects and industry demos',
        date: '2025-06-15',
        time: '10:00',
        location: 'Main Auditorium',
        category: 'Workshop'
      },
      {
        title: 'Spring Concert',
        description: 'Live music performance by campus bands and local artists',
        date: '2025-06-20',
        time: '19:00',
        location: 'Student Center',
        category: 'Club'
      },
      {
        title: 'Career Workshop',
        description: 'Learn about resume writing and interview skills',
        date: '2025-06-25',
        time: '14:00',
        location: 'Library Conference Room',
        category: 'Workshop'
      },
      {
        title: 'Basketball Tournament',
        description: 'Annual campus basketball tournament',
        date: '2025-07-01',
        time: '15:00',
        location: 'Sports Complex',
        category: 'Sports'
      },
      {
        title: 'Study Group Session',
        description: 'Group study session for final exams',
        date: '2025-07-05',
        time: '18:00',
        location: 'Library',
        category: 'Study'
      }
    ];

    sampleEvents.forEach(event => {
      db.run(
        'INSERT INTO events (title, description, date, time, location, category) VALUES (?, ?, ?, ?, ?, ?)',
        [event.title, event.description, event.date, event.time, event.location, event.category]
      );
    });
    console.log('Sample events added to database');
  }
});

// Helper functions for SQLite operations
const dbHelper = {
  // Get a single row
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Get multiple rows
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Run a query (INSERT, UPDATE, DELETE)
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = dbHelper;
