import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.small};
  z-index: 1000;
  padding: 1rem 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: ${props => props.theme.colors.white};
    flex-direction: column;
    padding: 1rem;
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const NavItem = styled.li`
  list-style: none;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.dark};
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.medium};
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 150px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: ${props => props.theme.colors.dark};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.primary};
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.dark};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.primary};
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  padding: 0;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: flex;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: ${props => props.theme.colors.dark};
    border-radius: 10px;
    transition: all 0.3s linear;
    transform-origin: 1px;

    &:nth-child(1) {
      transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'rotate(0)'};
    }

    &:nth-child(2) {
      opacity: ${props => props.$isOpen ? '0' : '1'};
      transform: ${props => props.$isOpen ? 'translateX(20px)' : 'translateX(0)'};
    }

    &:nth-child(3) {
      transform: ${props => props.$isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <Nav>
      <div className="container">
        <NavContainer>
          <Logo to="/">Eventify</Logo>
          
          <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </Hamburger>
          
          <NavMenu $isOpen={isMenuOpen}>
            <NavItem>
              <NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/events" onClick={() => setIsMenuOpen(false)}>Events</NavLink>
            </NavItem>
            
            {isAuthenticated ? (
              <>
                <NavItem>
                  <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/my-events" onClick={() => setIsMenuOpen(false)}>My Events</NavLink>
                </NavItem>
              </>
            ) : null}
          </NavMenu>
          
          <AuthButtons>
            {isAuthenticated ? (
              <UserMenu>
                <UserButton onClick={toggleUserMenu}>
                  {user?.name}
                  <span>▼</span>
                </UserButton>
                <Dropdown $isOpen={isUserMenuOpen}>
                  <DropdownItem to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem to="/my-events" onClick={() => setIsUserMenuOpen(false)}>
                    My Events
                  </DropdownItem>
                  <DropdownButton onClick={handleLogout}>
                    Logout
                  </DropdownButton>
                </Dropdown>
              </UserMenu>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-secondary">Login</NavLink>
                <NavLink to="/register" className="btn btn-primary">Sign Up</NavLink>
              </>
            )}
          </AuthButtons>
        </NavContainer>
      </div>
    </Nav>
  );
};

export default Navbar;