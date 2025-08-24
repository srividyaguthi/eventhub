const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { eventId, ticketType } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const ticket = event.ticketTypes.find(t => t.name === ticketType);
    if (!ticket) {
      return res.status(400).json({ message: 'Invalid ticket type' });
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticket.price * 100, // in cents
      currency: 'usd',
      metadata: {
        eventId: eventId,
        userId: req.user.id,
        ticketType: ticketType
      }
    });
    
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle payment confirmation webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update event registration status
    const eventId = paymentIntent.metadata.eventId;
    const userId = paymentIntent.metadata.userId;
    const ticketType = paymentIntent.metadata.ticketType;
    
    try {
      const event = await Event.findById(eventId);
      const attendee = event.attendees.find(a => 
        a.user.toString() === userId && a.ticketType === ticketType
      );
      
      if (attendee) {
        attendee.paymentStatus = 'completed';
        await event.save();
        
        // Send confirmation email (would be implemented in a real app)
        console.log(`Payment confirmed for user ${userId} for event ${eventId}`);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  }

  res.json({received: true});
});

module.exports = router;