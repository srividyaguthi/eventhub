import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';

const CheckInContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CheckInSection = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.medium};
  margin-bottom: 2rem;
`;

const ScannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ManualCheckIn = styled.div`
  background: ${props => props.theme.colors.light};
  border-radius: 8px;
  padding: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

const AttendeesList = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const AttendeeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  ${props => props.checkedIn && `
    background-color: rgba(76, 201, 240, 0.1);
  `}
`;

const CheckInButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.checkedIn ? props.theme.colors.success : props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

const CheckIn = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        setEvent(response.data.data.event);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleCheckIn = async (qrCode) => {
    setCheckingIn(true);
    try {
      const response = await axios.post(`/api/checkin/${eventId}/checkin`, { qrCode });
      toast.success('Attendee checked in successfully!');
      
      // Refresh event data
      const eventResponse = await axios.get(`/api/events/${eventId}`);
      setEvent(eventResponse.data.data.event);
      
      // Clear QR code input
      setQrCode('');
    } catch (error) {
      console.error('Error checking in attendee:', error);
      toast.error(error.response?.data?.message || 'Failed to check in attendee');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualCheckIn = () => {
    if (!qrCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }
    
    handleCheckIn(qrCode);
  };

  if (loading) {
    return (
      <CheckInContainer>
        <LoadingSpinner />
      </CheckInContainer>
    );
  }

  if (!event) {
    return (
      <CheckInContainer>
        <div className="text-center">
          <h2>Event not found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </CheckInContainer>
    );
  }

  const totalAttendees = event.attendees.length;
  const checkedInAttendees = event.attendees.filter(a => a.checkInStatus).length;

  return (
    <CheckInContainer>
      <PageHeader>
        <h1>Check-In: {event.title}</h1>
        <p>Manage attendee check-ins for your event</p>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <h3>Total Attendees</h3>
          <p>{totalAttendees}</p>
        </StatCard>
        <StatCard>
          <h3>Checked In</h3>
          <p>{checkedInAttendees}</p>
        </StatCard>
        <StatCard>
          <h3>Check-In Rate</h3>
          <p>{totalAttendees > 0 ? Math.round((checkedInAttendees / totalAttendees) * 100) : 0}%</p>
        </StatCard>
      </StatsGrid>

      <CheckInSection>
        <h2>Check-In Attendees</h2>
        
        <ScannerContainer>
          <p>Scan QR code from attendee's ticket</p>
          {/* In a real app, you would integrate a QR scanner component here */}
          <div style={{ 
            width: '300px', 
            height: '300px', 
            border: '2px dashed #ccc', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <p>QR Scanner Placeholder</p>
          </div>
        </ScannerContainer>
        
        <ManualCheckIn>
          <h3>Manual Check-In</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Enter QR code manually"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <button 
              className="btn btn-primary"
              onClick={handleManualCheckIn}
              disabled={checkingIn}
            >
              {checkingIn ? 'Processing...' : 'Check In'}
            </button>
          </div>
        </ManualCheckIn>
      </CheckInSection>

      <AttendeesList>
        <h2>Attendees List</h2>
        {event.attendees.length > 0 ? (
          event.attendees.map((attendee, index) => (
            <AttendeeItem key={index} checkedIn={attendee.checkInStatus}>
              <div>
                <strong>
                  {attendee.user ? attendee.user.name : 'Unknown User'}
                </strong>
                <p>Ticket: {attendee.ticketType}</p>
              </div>
              <div>
                {attendee.checkInStatus ? (
                  <span className="text-success">Checked In</span>
                ) : (
                  <CheckInButton
                    onClick={() => handleCheckIn(attendee.qrCode)}
                    disabled={checkingIn}
                  >
                    Check In
                  </CheckInButton>
                )}
              </div>
            </AttendeeItem>
          ))
        ) : (
          <p>No attendees registered for this event yet.</p>
        )}
      </AttendeesList>
    </CheckInContainer>
  );
};

export default CheckIn;