const express = require('express');
const {
  getEvents,
  getEvent,
  postEvent,
  putEvent,
  removeEvent,
  getMyEvents
} = require('../controllers/eventController');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (require authentication)
router.get('/my/events', auth, requireRole('organizer'), getMyEvents);
router.post('/', auth, requireRole('organizer'), postEvent);
router.put('/:id', auth, requireRole('organizer'), putEvent);
router.delete('/:id', auth, requireRole('organizer'), removeEvent);

module.exports = router; 