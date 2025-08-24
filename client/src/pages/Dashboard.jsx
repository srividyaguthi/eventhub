import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { mockEventsApi } from '../utils/mockData'; // Use mock data instead of API
import { useAuth } from '../context/AuthContext';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
  text-align: center;
  
  h3 {
    color: ${props => props.theme.colors.gray};
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
    margin: 0;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Use mock data instead of API calls
        const response = await mockEventsApi.getEvents();
        
        // Handle different response structures safely
        let allEvents = [];
        
        if (response.data && response.data.events) {
          allEvents = response.data.events;
        } else if (Array.isArray(response)) {
          allEvents = response;
        } else if (response.events) {
          allEvents = response.events;
        } else {
          allEvents = []; // Fallback to empty array
        }
        
        // Filter events by organizer (for demo, show all events)
        const myEvents = allEvents; // In a real app, you'd filter by organizer ID
        
        // Calculate stats with proper fallbacks
        const totalEvents = myEvents.length;
        const totalAttendees = myEvents.reduce((sum, event) => sum + (event.attendees?.length || 0), 0);
        const totalRevenue = myEvents.reduce((sum, event) => {
          return sum + (event.ticketTypes?.reduce((tSum, ticket) => 
            tSum + ((ticket.sold || 0) * (ticket.price || 0)), 0) || 0);
        }, 0);
        
        setStats({
          totalEvents: totalEvents || 0,
          totalAttendees: totalAttendees || 0,
          totalRevenue: totalRevenue || 0
        });
        
        // Get upcoming events (next 7 days)
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const upcoming = myEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= nextWeek;
        }).slice(0, 3);
        
        setUpcomingEvents(upcoming);
        
        // Get recent events (created in last 7 days)
        const recent = myEvents.filter(event => {
          const createdDate = new Date(event.createdAt);
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return createdDate >= weekAgo;
        }).slice(0, 3);
        
        setRecentEvents(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default values instead of crashing
        setStats({ totalEvents: 0, totalAttendees: 0, totalRevenue: 0 });
        setUpcomingEvents([]);
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Welcome back, {user.name}!</h1>
        <Link to="/events/create" className="btn btn-primary">
          Create New Event
        </Link>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <h3>Total Events</h3>
          <p>{stats.totalEvents || 0}</p>
        </StatCard>
        <StatCard>
          <h3>Total Attendees</h3>
          <p>{stats.totalAttendees || 0}</p>
        </StatCard>
        <StatCard>
          <h3>Total Revenue</h3>
          <p>${(stats.totalRevenue || 0).toFixed(2)}</p>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>Upcoming Events</h2>
          <Link to="/my-events" className="btn btn-secondary">
            View All
          </Link>
        </SectionHeader>

        {upcomingEvents.length > 0 ? (
          <EventsGrid>
            {upcomingEvents.map(event => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              
              return (
                <EventCard key={event._id}>
                  <EventImage image={event.image || 'https://via.placeholder.com/300x160?text=Event+Image'} />
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    <EventMeta>
                      <span>{eventDate.toLocaleDateString()}</span>
                      <span>{event.attendees?.length || 0} attendees</span>
                    </EventMeta>
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
            <p>No upcoming events. Create your first event!</p>
            <Link to="/events/create" className="btn btn-primary">
              Create Event
            </Link>
          </div>
        )}
      </Section>

      <Section>
        <SectionHeader>
          <h2>Recently Created Events</h2>
        </SectionHeader>

        {recentEvents.length > 0 ? (
          <EventsGrid>
            {recentEvents.map(event => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              
              return (
                <EventCard key={event._id}>
                  <EventImage image={event.image || 'https://via.placeholder.com/300x160?text=Event+Image'} />
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    <EventMeta>
                      <span>{eventDate.toLocaleDateString()}</span>
                      <span>{event.attendees?.length || 0} attendees</span>
                    </EventMeta>
                    <EventActions>
                      <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                        View
                      </Link>
                      <Link to={`/events/${event._id}/edit`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                    </EventActions>
                  </EventContent>
                </EventCard>
              );
            })}
          </EventsGrid>
        ) : (
          <p>No recently created events.</p>
        )}
      </Section>
    </DashboardContainer>
  );
};

export default Dashboard;