const db = require('./db');

const createEvent = async (event) => {
  const { title, description, date, time, location, category, user_id } = event;
  const result = await db.run(
    'INSERT INTO events (title, description, date, time, location, category, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, time, location, category, user_id]
  );
  return result.lastID;
};

const getAllEvents = async (category) => {
  let query = 'SELECT e.*, u.email as organizer_email FROM events e LEFT JOIN users u ON e.user_id = u.id';
  const params = [];
  
  if (category) {
    query += ' WHERE e.category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY e.date ASC, e.time ASC';
  return db.all(query, params);
};

const getEventById = async (id) => {
  return db.get(
    'SELECT e.*, u.email as organizer_email FROM events e LEFT JOIN users u ON e.user_id = u.id WHERE e.id = ?',
    [id]
  );
};

const updateEvent = async (id, event, userId) => {
  // First check if the user is the organizer of this event
  const existingEvent = await getEventById(id);
  if (!existingEvent || existingEvent.user_id !== userId) {
    throw new Error('Unauthorized to update this event');
  }

  const { title, description, date, time, location, category } = event;
  const result = await db.run(
    'UPDATE events SET title=?, description=?, date=?, time=?, location=?, category=? WHERE id=?',
    [title, description, date, time, location, category, id]
  );
  return result.changes > 0;
};

const deleteEvent = async (id, userId) => {
  // First check if the user is the organizer of this event
  const event = await getEventById(id);
  if (!event || event.user_id !== userId) {
    throw new Error('Unauthorized to delete this event');
  }

  const result = await db.run('DELETE FROM events WHERE id = ?', [id]);
  return result.changes > 0;
};

const getEventsByOrganizer = async (organizerId) => {
  return db.all('SELECT * FROM events WHERE user_id = ?', [organizerId]);
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer
}; 