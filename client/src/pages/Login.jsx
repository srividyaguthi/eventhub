import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  padding: 2.5rem; // Slightly increased padding
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

const DemoAccounts = styled.div`
  margin-top: 2rem;
  padding: 1.5rem; // Increased padding
  background-color: ${props => props.theme.colors.light};
  border-radius: 8px;
  
  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.dark};
  }
  
  .account {
    margin-bottom: 0.75rem; // Slightly more spacing
    padding: 1rem; // Increased padding
    background: ${props => props.theme.colors.white};
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    p {
      margin: 0;
      font-size: 0.9rem;
      flex: 1;
    }
    
    strong {
      color: ${props => props.theme.colors.primary};
    }
    
    button {
      margin-left: 1rem;
    }
  }
`;

const RoleSelector = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'attendee' // Default role
  });
  const [loading, setLoading] = useState(false);
  
  const { login, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to role-based dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Use a ref to track if we've already cleared errors
  const hasClearedError = React.useRef(false);

  useEffect(() => {
    // Clear error only once when component mounts
    if (!hasClearedError.current) {
      clearError();
      hasClearedError.current = true;
    }
  }, [clearError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      let redirectPath = '/dashboard';
      
      if (user.role === 'organizer') {
        redirectPath = '/dashboard';
      } else if (user.role === 'admin') {
        redirectPath = '/admin-dashboard';
      } else if (user.role === 'attendee') {
        redirectPath = '/events';
      }
      
      // Use the original intended path or the role-based path
      const finalPath = from !== '/dashboard' ? from : redirectPath;
      
      navigate(finalPath, { replace: true });
    }
  }, [isAuthenticated, navigate, from, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password, formData.role);
      if (result.success) {
        toast.success('Logged in successfully!');
        // Navigation is handled by the useEffect above
      }
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, password, role = 'attendee') => {
    setFormData({ email, password, role });
    
    // Auto-submit after a short delay to show the filled values
    setTimeout(() => {
      handleSubmit(new Event('submit'));
    }, 100);
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </AuthHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AuthForm onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <RoleSelector>
            <label className="form-label">Login As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="attendee">Event Attendee</option>
              <option value="organizer">Event Organizer</option>
              <option value="admin">Administrator</option>
            </select>
          </RoleSelector>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </AuthForm>

        <AuthFooter>
          <p>Don't have an account? <Link to="/register">Create one here</Link></p>
        </AuthFooter>

        <DemoAccounts>
          <h3>Demo Accounts</h3>
          <div className="account">
            <p><strong>Organizer Account:</strong> organizer@demo.com / password123</p>
            <button 
              className="btn btn-sm btn-success"
              onClick={() => handleDemoLogin('organizer@demo.com', 'password123', 'organizer')}
            >
              Login as Organizer
            </button>
          </div>
          <div className="account">
            <p><strong>Attendee Account:</strong> attendee@demo.com / password123</p>
            <button 
              className="btn btn-sm btn-success"
              onClick={() => handleDemoLogin('attendee@demo.com', 'password123', 'attendee')}
            >
              Login as Attendee
            </button>
          </div>
          <div className="account">
            <p><strong>Admin Account:</strong> admin@demo.com / password123</p>
            <button 
              className="btn btn-sm btn-success"
              onClick={() => handleDemoLogin('admin@demo.com', 'password123', 'admin')}
            >
              Login as Admin
            </button>
          </div>
        </DemoAccounts>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;