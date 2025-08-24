// backend/demoData.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

const createDemoData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventmanagement', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create demo users
    const organizerUser = await User.create({
      name: 'Demo Organizer',
      email: 'organizer@demo.com',
      password: 'password123',
      role: 'organizer'
    });

    const attendeeUser = await User.create({
      name: 'Demo Attendee',
      email: 'attendee@demo.com',
      password: 'password123',
      role: 'attendee'
    });

    // Create demo events
    const demoEvent = await Event.create({
      title: 'Tech Conference 2023',
      description: 'Join us for the biggest tech conference of the year! Featuring talks from industry experts, workshops, and networking opportunities.',
      organizer: organizerUser._id,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      agenda: `9:00 AM - Registration\n10:00 AM - Keynote: Future of Technology\n11:30 AM - Workshop: AI Development\n1:00 PM - Lunch Break\n2:30 PM - Panel Discussion: Web3 Trends\n4:00 PM - Networking Session`,
      date: new Date('2023-12-15'),
      time: '9:00 AM',
      location: 'Convention Center, 123 Main St, City',
      isVirtual: false,
      ticketTypes: [
        {
          name: 'General Admission',
          price: 99.99,
          quantity: 100,
          sold: 25
        },
        {
          name: 'VIP Pass',
          price: 199.99,
          quantity: 50,
          sold: 10
        }
      ],
      attendees: [
        {
          user: attendeeUser._id,
          ticketType: 'General Admission',
          paymentStatus: 'completed',
          checkInStatus: false,
          qrCode: 'QR-TECH-2023-ATTENDEE-001',
          registeredAt: new Date()
        }
      ]
    });

    console.log('Demo data created successfully!');
    console.log('Organizer:', organizerUser.email, '/ password123');
    console.log('Attendee:', attendeeUser.email, '/ password123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo data:', error);
    process.exit(1);
  }
};

createDemoData();