// Mock events data
export const mockEvents = [
    {
      _id: '1',
      title: 'Tech Conference 2023',
      description: 'Join us for the biggest tech conference of the year! Featuring talks from industry experts, workshops, and networking opportunities.',
      organizer: { _id: '1', name: 'Demo Organizer', email: 'organizer@demo.com' },
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      date: '2023-12-15',
      time: '9:00 AM',
      location: 'Convention Center, 123 Main St, City',
      isVirtual: false,
      ticketTypes: [
        { name: 'General Admission', price: 99.99, quantity: 100, sold: 25 },
        { name: 'VIP Pass', price: 199.99, quantity: 50, sold: 10 }
      ],
      attendees: [],
      createdAt: '2023-10-01'
    },
    {
      _id: '2',
      title: 'Music Festival',
      description: 'A weekend of amazing music performances from top artists across various genres.',
      organizer: { _id: '1', name: 'Demo Organizer', email: 'organizer@demo.com' },
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      date: '2023-11-20',
      time: '2:00 PM',
      location: 'City Park, Downtown',
      isVirtual: false,
      ticketTypes: [
        { name: 'General Admission', price: 79.99, quantity: 500, sold: 150 },
        { name: 'VIP Experience', price: 249.99, quantity: 100, sold: 30 }
      ],
      attendees: [],
      createdAt: '2023-09-15'
    },
    {
      _id: '3',
      title: 'Web Development Workshop',
      description: 'Learn modern web development techniques with hands-on workshops and expert guidance.',
      organizer: { _id: '1', name: 'Demo Organizer', email: 'organizer@demo.com' },
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      date: '2023-10-30',
      time: '10:00 AM',
      location: 'Tech Hub, Innovation District',
      isVirtual: true,
      zoomLink: 'https://zoom.us/j/123456789',
      ticketTypes: [
        { name: 'Student Pass', price: 29.99, quantity: 50, sold: 15 },
        { name: 'Professional Pass', price: 59.99, quantity: 30, sold: 12 }
      ],
      attendees: [],
      createdAt: '2023-09-20'
    }
  ];
  
  // Mock API functions for events
  export const mockEventsApi = {
    getEvents: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      return {
        status: 'success',
        data: {
          events: mockEvents
        }
      };
    },
    
    getEvent: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
      const event = mockEvents.find(e => e._id === id);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      return {
        status: 'success',
        data: {
          event
        }
      };
    },
    
    createEvent: async (eventData) => {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
        
        const newEvent = {
          _id: String(Math.random().toString(36).substr(2, 9)),
          ...eventData,
          createdAt: new Date().toISOString(),
          attendees: [],
          organizer: {
            _id: '1',
            name: 'Demo Organizer',
            email: 'organizer@demo.com'
          }
        };
        
        mockEvents.push(newEvent);
        
        return {
          status: 'success',
          data: {
            event: newEvent
          }
        };
      }
  };