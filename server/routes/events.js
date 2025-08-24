const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name email');
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (authenticated users only)
router.post('/', auth, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id
    };
    
    const event = await Event.create(eventData);
    
    // Populate organizer info
    await event.populate('organizer', 'name email');
    
    res.status(201).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event (only by organizer)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');
    
    res.status(200).json({
      status: 'success',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete event (only by organizer)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const { ticketType } = req.body;
    
    // Check if ticket type is valid
    const ticket = event.ticketTypes.find(t => t.name === ticketType);
    if (!ticket) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }
    
    // Check if ticket is available
    if (ticket.sold >= ticket.quantity) {
      return res.status(400).json({ message: 'Tickets sold out for this type' });
    }
    
    // Check if user already registered
    const alreadyRegistered = event.attendees.find(a => a.user.toString() === req.user.id);
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    // Generate QR code (in a real app, this would be a proper QR code)
    const qrCode = `QR-${event._id}-${req.user.id}-${Date.now()}`;
    
    // Add attendee
    event.attendees.push({
      user: req.user.id,
      ticketType,
      qrCode
    });
    
    // Update ticket sold count
    ticket.sold += 1;
    
    await event.save();
    
    // Emit real-time update
    req.io.to(event._id.toString()).emit('attendeeUpdate', {
      eventId: event._id,
      attendees: event.attendees.length,
      ticketSales: event.ticketTypes.reduce((acc, t) => acc + t.sold, 0)
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        registration: {
          event: event.title,
          ticketType,
          qrCode
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;