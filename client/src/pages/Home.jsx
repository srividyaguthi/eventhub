import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: ${props => props.theme.colors.white};
  padding: 6rem 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background: ${props => props.theme.colors.white};
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
  
  svg {
    width: 60px;
    height: 60px;
    margin-bottom: 1.5rem;
    fill: ${props => props.theme.colors.primary};
  }
`;

const EventsSection = styled.section`
  padding: 5rem 0;
  background: ${props => props.theme.colors.light};
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
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
  height: 200px;
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

const EventDate = styled.p`
  color: ${props => props.theme.colors.gray};
  margin-bottom: 1rem;
`;

const CtaSection = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.secondary} 0%, ${props => props.theme.colors.primary} 100%);
  color: ${props => props.theme.colors.white};
  text-align: center;
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

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        
        // Handle different response structures
        let eventsData = [];
        
        if (response.data.data && response.data.data.events) {
          eventsData = response.data.data.events;
        } else if (Array.isArray(response.data)) {
          eventsData = response.data;
        } else if (response.data.events) {
          eventsData = response.data.events;
        }
        
        setEvents(eventsData.slice(0, 6));
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);

  return (
    <>
      <HeroSection>
        <div className="container">
          <HeroTitle>Create & Manage Events Effortlessly</HeroTitle>
          <HeroSubtitle>
            The all-in-one platform for event organizers. Create beautiful event pages, sell tickets, manage attendees, and much more.
          </HeroSubtitle>
          <Link to="/events/create" className="btn btn-success btn-lg">
            Create Your Event
          </Link>
        </div>
      </HeroSection>

      <FeaturesSection>
        <div className="container">
          <SectionTitle>Powerful Features</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
              </svg>
              <h3>Event Creation</h3>
              <p>Create customizable event pages with details, agenda, and images.</p>
            </FeatureCard>

            <FeatureCard>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
              <h3>Ticket Sales</h3>
              <p>Sell tickets with secure payment processing and multiple ticket types.</p>
            </FeatureCard>

            <FeatureCard>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
              </svg>
              <h3>Attendee Management</h3>
              <p>Track registrations, check-ins, and manage your attendees efficiently.</p>
            </FeatureCard>

            <FeatureCard>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-6h11v6zm5 0h-3v-6h3v6zm0-8H4V6h16v4z"/>
              </svg>
              <h3>Real-time Analytics</h3>
              <p>Get insights into ticket sales, attendance, and event performance.</p>
            </FeatureCard>

            <FeatureCard>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/>
              </svg>
              <h3>Engagement Tools</h3>
              <p>Send messages, collect feedback, and keep attendees engaged.</p>
            </FeatureCard>

            <FeatureCard>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2zm0 14H3V8h18v12zM9 10v8l7-4z"/>
              </svg>
              <h3>Virtual Events</h3>
              <p>Integrate with Zoom for seamless virtual event experiences.</p>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <EventsSection>
        <div className="container">
          <SectionTitle>Upcoming Events</SectionTitle>
          {loading ? (
            <LoadingSpinner />
          ) : events.length > 0 ? (
            <>
              <EventsGrid>
                {events.map(event => (
                  <EventCard key={event._id}>
                    <EventImage image={event.image || 'https://via.placeholder.com/300x200?text=Event+Image'} />
                    <EventContent>
                      <EventTitle>{event.title}</EventTitle>
                      <EventDate>
                        {new Date(event.date).toLocaleDateString()} • {event.time}
                      </EventDate>
                      <p>{event.description && event.description.substring(0, 100)}...</p>
                      <Link to={`/events/${event._id}`} className="btn btn-primary mt-2">
                        View Details
                      </Link>
                    </EventContent>
                  </EventCard>
                ))}
              </EventsGrid>
              <div className="text-center mt-4">
                <Link to="/events" className="btn btn-secondary">
                  View All Events
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p>No events found. Be the first to create an event!</p>
              <Link to="/events/create" className="btn btn-primary">
                Create Event
              </Link>
            </div>
          )}
        </div>
      </EventsSection>

      <CtaSection>
        <div className="container">
          <h2>Ready to Create Your Next Event?</h2>
          <p className="mb-4">Join thousands of organizers who use our platform to create memorable events.</p>
          <Link to="/register" className="btn btn-light btn-lg">
            Get Started Now
          </Link>
        </div>
      </CtaSection>
    </>
  );
};

export default Home;