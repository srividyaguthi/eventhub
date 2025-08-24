const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json({ status: 'success', data: { events } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user.id });
    await event.populate('organizer', 'name email');
    res.status(201).json({ status: 'success', data: { event } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('organizer', 'name email');
    res.status(200).json({ status: 'success', data: { event: updatedEvent } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizer.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const { ticketType } = req.body;
    const ticket = event.ticketTypes.find(t => t.name === ticketType);
    if (!ticket) return res.status(400).json({ message: 'Invalid ticket type' });
    if (ticket.sold >= ticket.quantity) return res.status(400).json({ message: 'Tickets sold out' });
    
    const alreadyRegistered = event.attendees.find(a => a.user && a.user.toString() === req.user.id);
    if (alreadyRegistered) return res.status(400).json({ message: 'Already registered' });
    
    const qrCode = `QR-${event._id}-${req.user.id}-${Date.now()}`;
    event.attendees.push({ user: req.user.id, ticketType, qrCode });
    ticket.sold += 1;
    
    await event.save();
    res.status(200).json({ status: 'success', data: { registration: { event: event.title, ticketType, qrCode } } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;