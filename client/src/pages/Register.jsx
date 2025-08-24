import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AuthContainer = styled.div`
  max-width: 550px; // Increased from 400px
  margin: 2rem auto;
  padding: 2rem;
`;

const AuthCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  padding: 2.5rem; // Increased padding
  box-shadow: ${props => props.theme.shadows.medium};
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  p {
    color: ${props => props.theme.colors.gray};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    
    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  background-color: rgba(230, 57, 70, 0.1);
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'organizer'
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear password error when user starts typing
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <h1>Create Account</h1>
          <p>Join us to start creating and managing events</p>
        </AuthHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

        <AuthForm onSubmit={handleSubmit}>
          <FormRow>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="organizer">Event Organizer</option>
                <option value="attendee">Event Attendee</option>
              </select>
            </div>
          </FormRow>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <FormRow>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          </FormRow>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </AuthForm>

        <AuthFooter>
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </AuthFooter>
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;