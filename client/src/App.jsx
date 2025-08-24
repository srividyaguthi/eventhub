import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/GlobalStyles';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventCreate from './pages/EventCreate';
import EventDetail from './pages/EventDetail';
import EventEdit from './pages/EventEdit';
import CheckIn from './pages/CheckIn';
import MyEvents from './pages/MyEvents';

// Context
import { AuthProvider } from './context/AuthContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed navbar */
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <AppContainer>
            <Navbar />
            <MainContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/events/create" 
                  element={
                    <ProtectedRoute>
                      <EventCreate />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route 
                  path="/events/:id/edit" 
                  element={
                    <ProtectedRoute>
                      <EventEdit />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkin/:eventId" 
                  element={
                    <ProtectedRoute>
                      <CheckIn />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-events" 
                  element={
                    <ProtectedRoute>
                      <MyEvents />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </MainContent>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </AppContainer>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;