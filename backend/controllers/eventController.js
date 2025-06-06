const Event = require('../models/event');
const User = require('../models/user');

const getEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const events = await Event.getAllEvents(category);
    res.json(events);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error('Get event error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const postEvent = async (req, res) => {
  try {
    // Check if user is an organizer
    const isOrganizer = await User.isOrganizer(req.user.id);
    if (!isOrganizer) {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }

    const event = await Event.createEvent({ ...req.body, user_id: req.user.id });
    res.status(201).json(event);
  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const putEvent = async (req, res) => {
  try {
    const event = await Event.updateEvent(req.params.id, req.body, req.user.id);
    res.json(event);
  } catch (err) {
    if (err.message === 'Unauthorized to update this event') {
      return res.status(403).json({ message: err.message });
    }
    console.error('Update event error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeEvent = async (req, res) => {
  try {
    const success = await Event.deleteEvent(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized to delete this event') {
      return res.status(403).json({ message: err.message });
    }
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyEvents = async (req, res) => {
  try {
    // Check if user is an organizer
    const isOrganizer = await User.isOrganizer(req.user.id);
    if (!isOrganizer) {
      return res.status(403).json({ message: 'Only organizers can view their events' });
    }

    const events = await Event.getEventsByOrganizer(req.user.id);
    res.json(events);
  } catch (err) {
    console.error('Get my events error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  postEvent,
  putEvent,
  removeEvent,
  getMyEvents
}; 