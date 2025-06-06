const db = require('./db');
const bcrypt = require('bcrypt');

class User {
  static async create(email, password, role = 'user') {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, passwordHash, role]
    );
    return result.lastID;
  }

  static async findByEmail(email) {
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }

  static async isOrganizer(userId) {
    const user = await this.findById(userId);
    return user && user.role === 'organizer';
  }

  static async getEventsByOrganizer(organizerId) {
    return db.all('SELECT * FROM events WHERE user_id = ?', [organizerId]);
  }
}

module.exports = User;
