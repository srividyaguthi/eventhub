import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { mockEventsApi } from '../utils/mockData';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const FormTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.primary};
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const TicketTypesContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
`;

const TicketTypeItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const EventCreate = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVirtual = watch('isVirtual', false);

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: 0, quantity: 0 }]);
  };

  const removeTicketType = (index) => {
    const updated = [...ticketTypes];
    updated.splice(index, 1);
    setTicketTypes(updated);
  };

  const updateTicketType = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = field === 'name' ? value : 
                           field === 'price' ? parseFloat(value) || 0 : 
                           parseInt(value) || 0;
    setTicketTypes(updated);
  };

  const onSubmit = async (data) => {
    if (ticketTypes.length === 0) {
      toast.error('Please add at least one ticket type');
      return;
    }

    // Validate ticket types
    for (const ticket of ticketTypes) {
      if (!ticket.name.trim()) {
        toast.error('All ticket types must have a name');
        return;
      }
      if (ticket.price < 0) {
        toast.error('Ticket price cannot be negative');
        return;
      }
      if (ticket.quantity < 1) {
        toast.error('Ticket quantity must be at least 1');
        return;
      }
    }

    setLoading(true);
    try {
      const eventData = {
        ...data,
        ticketTypes,
        date: new Date(data.date).toISOString(),
        organizer: user.id
      };

      const response = await mockEventsApi.createEvent(eventData);
      toast.success('Event created successfully!');
      navigate(`/events/${response.data.event._id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <FormContainer>
        <FormTitle>Create New Event</FormTitle>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              type="text"
              className="form-control"
              {...register('title', { required: 'Event title is required' })}
            />
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              {...register('description', { required: 'Description is required' })}
            ></textarea>
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </div>

          <FormRow>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-control"
                {...register('time', { required: 'Time is required' })}
              />
              {errors.time && <ErrorMessage>{errors.time.message}</ErrorMessage>}
            </div>
          </FormRow>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                {...register('isVirtual')}
              />
              {' '}Virtual Event
            </label>
          </div>

          {isVirtual ? (
            <div className="form-group">
              <label className="form-label">Zoom Meeting Link</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://zoom.us/j/..."
                {...register('zoomLink')}
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Venue address"
                {...register('location')}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Event Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              {...register('image')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Agenda</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Format: Time - Activity (one per line)"
              {...register('agenda')}
            ></textarea>
          </div>

          <div className="form-group">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="form-label mb-0">Ticket Types</label>
              <button type="button" className="btn btn-success btn-sm" onClick={addTicketType}>
                Add Ticket Type
              </button>
            </div>

            {ticketTypes.length === 0 ? (
              <p className="text-muted">No ticket types added yet.</p>
            ) : (
              <TicketTypesContainer>
                {ticketTypes.map((ticket, index) => (
                  <TicketTypeItem key={index}>
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={ticket.name}
                        onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        placeholder="e.g., General Admission"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Price ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={ticket.price}
                        onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={ticket.quantity}
                        onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeTicketType(index)}
                    >
                      Remove
                    </button>
                  </TicketTypeItem>
                ))}
              </TicketTypesContainer>
            )}
          </div>

          <FormActions>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </FormActions>
        </Form>
      </FormContainer>
    </div>
  );
};

export default EventCreate;