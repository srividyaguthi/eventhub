import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { mockEventsApi } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

const EventsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  select, input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const EventImage = styled.div`
  height: 160px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
`;

const EventMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.colors.gray};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const EventStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Stat = styled.div`
  padding: 0.5rem;
  background: ${props => props.theme.colors.light};
  border-radius: 4px;
  
  h4 {
    font-size: 0.875rem;
    margin: 0;
    color: ${props => props.theme.colors.gray};
  }
  
  p {
    font-weight: bold;
    margin: 0;
    color: ${props => props.theme.colors.primary};
  }
`;

const EventActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid ${props => props.theme.colors.primary};
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        // Hardcoded event data
        const hardcodedEvents = [
          {
            _id: '1',
            title: 'Tech Conference 2025',
            description: 'A conference about the latest in tech.',
            date: '2025-09-15',
            image: 'https://via.placeholder.com/300x160?text=Tech+Conference',
            ticketTypes: [
              { quantity: 100, sold: 50, price: 20 },
              { quantity: 50, sold: 30, price: 50 },
            ],
            attendees: [{ id: 'a1' }, { id: 'a2' }],
          },
          {
            _id: '2',
            title: 'Music Festival',
            description: 'Enjoy live music performances.',
            date: '2025-08-30',
            image: 'https://via.placeholder.com/300x160?text=Music+Festival',
            ticketTypes: [
              { quantity: 200, sold: 150, price: 30 },
            ],
            attendees: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }],
          },
          {
            _id: '3',
            title: 'Art Exhibition',
            description: 'Explore modern art.',
            date: '2025-07-20',
            image: 'https://via.placeholder.com/300x160?text=Art+Exhibition',
            ticketTypes: [
              { quantity: 50, sold: 20, price: 15 },
            ],
            attendees: [],
          },
        ];
  
        // Simulate API response
        setEvents(hardcodedEvents);
        setFilteredEvents(hardcodedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMyEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (statusFilter === 'upcoming') return eventDate >= now;
        if (statusFilter === 'past') return eventDate < now;
        return true;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, statusFilter, searchQuery]);

  if (loading) {
    return (
      <EventsContainer>
        <LoadingSpinner />
      </EventsContainer>
    );
  }

  return (
    <EventsContainer>
      <PageHeader>
        <h1>My Events</h1>
        <Link to="/events/create" className="btn btn-primary">
          Create New Event
        </Link>
      </PageHeader>

      <Filters>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
        
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Filters>

      {filteredEvents.length > 0 ? (
        <EventsGrid>
          {filteredEvents.map(event => {
            const totalTickets = event.ticketTypes ? 
              event.ticketTypes.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0) : 0;
            const soldTickets = event.ticketTypes ? 
              event.ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0) : 0;
            const revenue = event.ticketTypes ? 
              event.ticketTypes.reduce((sum, ticket) => sum + ((ticket.sold || 0) * (ticket.price || 0)), 0) : 0;
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            
            return (
              <EventCard key={event._id}>
                <EventImage image={event.image || 'https://via.placeholder.com/300x160?text=Event+Image'} />
                <EventContent>
                  <EventTitle>{event.title}</EventTitle>
                  <EventMeta>
                    <span>{eventDate.toLocaleDateString()}</span>
                    <span className={isPast ? 'text-muted' : 'text-success'}>
                      {isPast ? 'Past' : 'Upcoming'}
                    </span>
                  </EventMeta>
                  
                  <EventStats>
                    <Stat>
                      <h4>Attendees</h4>
                      <p>{event.attendees ? event.attendees.length : 0}</p>
                    </Stat>
                    <Stat>
                      <h4>Tickets</h4>
                      <p>{soldTickets}/{totalTickets}</p>
                    </Stat>
                    <Stat>
                      <h4>Revenue</h4>
                      <p>${revenue.toFixed(2)}</p>
                    </Stat>
                  </EventStats>
                  
                  <EventActions>
                    <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                      View
                    </Link>
                    <Link to={`/events/${event._id}/edit`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    {!isPast && (
                      <Link to={`/checkin/${event._id}`} className="btn btn-success btn-sm">
                        Check-In
                      </Link>
                    )}
                  </EventActions>
                </EventContent>
              </EventCard>
            );
          })}
        </EventsGrid>
      ) : (
        <div className="text-center">
          <p>No events found.</p>
          <Link to="/events/create" className="btn btn-primary">
            Create Your First Event
          </Link>
        </div>
      )}
    </EventsContainer>
  );
};

export default MyEvents;