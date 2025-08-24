import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
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
  background-color: ${props => props.theme.colors.light};
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

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.danger};
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.gray};
  
  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.dark};
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        setError('Please log in to view your events');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try different possible endpoints and response structures
        let response;
        let eventsData = [];

        try {
          // Try user-specific events endpoint first
          response = await axios.get(`/api/users/${user.id}/events`);
        } catch (err) {
          // Fallback to general events endpoint
          response = await axios.get('/api/events');
        }

        // Handle different response structures
        if (response.data) {
          // Try different possible response structures
          if (response.data.events) {
            eventsData = response.data.events;
          } else if (response.data.data && response.data.data.events) {
            eventsData = response.data.data.events;
          } else if (Array.isArray(response.data.data)) {
            eventsData = response.data.data;
          } else if (Array.isArray(response.data)) {
            eventsData = response.data;
          } else {
            console.log('Response structure:', response.data);
            eventsData = [];
          }
        }

        // Filter events by current user if using general endpoint
        if (user && user.id) {
          eventsData = eventsData.filter(event => 
            event.organizer === user.id || 
            event.organizerId === user.id ||
            event.createdBy === user.id
          );
        }

        setEvents(eventsData);
        setFilteredEvents(eventsData);
        
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.response?.data?.message || 'Failed to fetch events');
        
        // For development, you can use mock data
        if (process.env.NODE_ENV === 'development') {
          const mockEvents = [
            {
              _id: '1',
              title: 'Tech Conference 2024',
              description: 'Annual technology conference',
              date: '2024-12-01',
              image: 'https://via.placeholder.com/300x160?text=Tech+Conference',
              ticketTypes: [
                { quantity: 100, sold: 75, price: 50 },
                { quantity: 50, sold: 30, price: 100 }
              ],
              attendees: new Array(105).fill(null)
            },
            {
              _id: '2',
              title: 'Music Festival',
              description: 'Summer music festival',
              date: '2024-07-15',
              image: 'https://via.placeholder.com/300x160?text=Music+Festival',
              ticketTypes: [
                { quantity: 500, sold: 450, price: 75 }
              ],
              attendees: new Array(450).fill(null)
            }
          ];
          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user, isAuthenticated]);

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
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (!isAuthenticated) {
    return (
      <EventsContainer>
        <EmptyState>
          <h3>Authentication Required</h3>
          <p>Please log in to view your events.</p>
          <Link to="/login" className="btn btn-primary">
            Log In
          </Link>
        </EmptyState>
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

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

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
            // Safely calculate stats with fallback values
            const ticketTypes = event.ticketTypes || [];
            const attendees = event.attendees || [];
            
            const totalTickets = ticketTypes.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0);
            const soldTickets = ticketTypes.reduce((sum, ticket) => sum + (ticket.sold || 0), 0);
            const revenue = ticketTypes.reduce((sum, ticket) => sum + ((ticket.sold || 0) * (ticket.price || 0)), 0);
            
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            
            return (
              <EventCard key={event._id}>
                <EventImage 
                  image={event.image || 'https://via.placeholder.com/300x160?text=Event+Image'} 
                />
                <EventContent>
                  <EventTitle>{event.title || 'Untitled Event'}</EventTitle>
                  <EventMeta>
                    <span>{eventDate.toLocaleDateString()}</span>
                    <span className={isPast ? 'text-muted' : 'text-success'}>
                      {isPast ? 'Past' : 'Upcoming'}
                    </span>
                  </EventMeta>
                  
                  <EventStats>
                    <Stat>
                      <h4>Attendees</h4>
                      <p>{attendees.length}</p>
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
        <EmptyState>
          <h3>No Events Found</h3>
          <p>
            {searchQuery || statusFilter !== 'all' 
              ? 'No events match your current filters.' 
              : "You haven't created any events yet."
            }
          </p>
          <Link to="/events/create" className="btn btn-primary">
            Create Your First Event
          </Link>
        </EmptyState>
      )}
    </EventsContainer>
  );
};

export default MyEvents;