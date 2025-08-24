import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';

const EventContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const EventHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const EventImage = styled.div`
  flex: 1;
  min-height: 300px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${props => props.theme.colors.gray};
  }
`;

const TicketSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const TicketTypes = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const TicketType = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(67, 97, 238, 0.05);
  }
  
  ${props => props.selected && `
    border-color: ${props.theme.colors.primary};
    background-color: rgba(67, 97, 238, 0.1);
  `}
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EventContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const EventDetails = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const AgendaList = styled.ul`
  list-style: none;
`;

const AgendaItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrganizerCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const QrCodeCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
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

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data.data.event);
        
        // Check if user is already registered
        if (isAuthenticated && response.data.data.event.attendees) {
          const userRegistration = response.data.data.event.attendees.find(
            a => a.user && a.user._id === user.id
          );
          if (userRegistration) {
            setRegistrationData(userRegistration);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isAuthenticated, user]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to register for this event');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    if (!selectedTicket) {
      toast.error('Please select a ticket type');
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post(`/api/events/${id}/register`, {
        ticketType: selectedTicket
      });

      toast.success('Successfully registered for the event!');
      setRegistrationData(response.data.data.registration);
      
      // Refresh event data
      const eventResponse = await axios.get(`/api/events/${id}`);
      setEvent(eventResponse.data.data.event);
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <EventContainer>
        <LoadingSpinner />
      </EventContainer>
    );
  }

  if (!event) {
    return (
      <EventContainer>
        <div className="text-center">
          <h2>Event not found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </EventContainer>
    );
  }

  const isOrganizer = isAuthenticated && user.id === event.organizer._id;
  const isRegistered = registrationData !== null;

  return (
    <EventContainer>
      <EventHeader>
        <EventImage image={event.image || 'https://via.placeholder.com/500x300?text=Event+Image'} />
        <EventInfo>
          <EventTitle>{event.title}</EventTitle>
          <EventMeta>
            <MetaItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
              </svg>
              <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
            </MetaItem>
            <MetaItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
              </svg>
              <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
            </MetaItem>
            {event.isVirtual && event.zoomLink && (
              <MetaItem>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 9H6V9h5v4zm4 0h-3V9h3v4zm0-6h-3V6h3v1zm4 6h-3V9h3v4zm0-6h-3V6h3v1z"/>
                </svg>
                <a href={event.zoomLink} target="_blank" rel="noopener noreferrer">
                  Join Zoom Meeting
                </a>
              </MetaItem>
            )}
          </EventMeta>
          
          <p>{event.description}</p>
          
          {!isOrganizer && !isRegistered && (
            <TicketSection>
              <h3>Register for this Event</h3>
              <TicketTypes>
                {event.ticketTypes.map((ticket, index) => (
                  <TicketType
                    key={index}
                    selected={selectedTicket === ticket.name}
                    onClick={() => setSelectedTicket(ticket.name)}
                  >
                    <div>
                      <strong>{ticket.name}</strong>
                      <p>{ticket.sold} of {ticket.quantity} sold</p>
                    </div>
                    <div>${ticket.price.toFixed(2)}</div>
                  </TicketType>
                ))}
              </TicketTypes>
              
              <RegisterButton
                onClick={handleRegister}
                disabled={!selectedTicket || registering}
              >
                {registering ? 'Processing...' : 'Register Now'}
              </RegisterButton>
            </TicketSection>
          )}
          
          {isOrganizer && (
            <div className="mt-3">
              <button 
                className="btn btn-primary mr-2"
                onClick={() => navigate(`/events/${id}/edit`)}
              >
                Edit Event
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/checkin/${id}`)}
              >
                Check-In Attendees
              </button>
            </div>
          )}
          
          {isRegistered && (
            <TicketSection>
              <h3>Your Registration</h3>
              <p>Ticket Type: <strong>{registrationData.ticketType}</strong></p>
              <p>Status: <strong>{registrationData.paymentStatus}</strong></p>
              
              {registrationData.qrCode && (
                <div className="mt-3">
                  <p>Your QR Code for check-in:</p>
                  <QRCode value={registrationData.qrCode} size={128} />
                </div>
              )}
            </TicketSection>
          )}
        </EventInfo>
      </EventHeader>
      
      <EventContent>
        <EventDetails>
          <h2>Event Details</h2>
          <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br/>') }} />
          
          {event.agenda && event.agenda.length > 0 && (
            <div className="mt-4">
              <h3>Agenda</h3>
              <AgendaList>
                {event.agenda.split('\n').map((item, index) => (
                  <AgendaItem key={index}>{item}</AgendaItem>
                ))}
              </AgendaList>
            </div>
          )}
        </EventDetails>
        
        <Sidebar>
          <OrganizerCard>
            <h3>Organizer</h3>
            <p>{event.organizer.name}</p>
            <p>{event.organizer.email}</p>
          </OrganizerCard>
          
          <QrCodeCard>
            <h3>Share this Event</h3>
            <QRCode value={window.location.href} size={128} />
            <p className="mt-2">Scan to share this event</p>
          </QrCodeCard>
        </Sidebar>
      </EventContent>
    </EventContainer>
  );
};

export default EventDetail;