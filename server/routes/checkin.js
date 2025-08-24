const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Check in attendee
router.post('/:eventId/checkin', auth, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to check in attendees' });
    }
    
    const attendee = event.attendees.find(a => a.qrCode === qrCode);
    if (!attendee) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }
    
    if (attendee.checkInStatus) {
      return res.status(400).json({ message: 'Attendee already checked in' });
    }
    
    attendee.checkInStatus = true;
    await event.save();
    
    // Emit real-time update
    req.io.to(event._id.toString()).emit('checkInUpdate', {
      eventId: event._id,
      checkedIn: event.attendees.filter(a => a.checkInStatus).length
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        attendee: {
          name: attendee.user.name, // Would be populated in a real app
          ticketType: attendee.ticketType,
          checkInTime: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get check-in stats
router.get('/:eventId/stats', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view stats' });
    }
    
    const totalAttendees = event.attendees.length;
    const checkedIn = event.attendees.filter(a => a.checkInStatus).length;
    const ticketSales = event.ticketTypes.reduce((acc, t) => acc + t.sold, 0);
    const revenue = event.ticketTypes.reduce((acc, t) => acc + (t.sold * t.price), 0);
    
    res.status(200).json({
      status: 'success',
      data: {
        totalAttendees,
        checkedIn,
        ticketSales,
        revenue
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;