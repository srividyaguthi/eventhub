import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#4361ee',
    secondary: '#3a0ca3',
    accent: '#f72585',
    success: '#4cc9f0',
    warning: '#fca311',
    danger: '#e63946',
    light: '#f8f9fa',
    dark: '#212529',
    gray: '#6c757d',
    white: '#ffffff'
  },
  fonts: {
    primary: '"Poppins", sans-serif',
    secondary: '"Montserrat", sans-serif'
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    large: '1200px'
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 6px rgba(0,0,0,0.1)',
    large: '0 10px 15px rgba(0,0,0,0.1)'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    width: 100%;
    height: 100%;
  }

  body {
    font-family: ${theme.fonts.primary};
    line-height: 1.6;
    color: ${theme.colors.dark};
    background-color: #f8f9fa;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden; /* Prevent horizontal scroll */
  }

  /* Root container should fill entire viewport */
  #root {
    width: 100%;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.secondary};
    font-weight: 700;
    margin-bottom: 1rem;
    color: ${theme.colors.dark};
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    text-decoration: none;
    color: ${theme.colors.primary};
    transition: color 0.3s ease;
    &:hover {
      color: ${theme.colors.secondary};
    }
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Standard container for content sections */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Full-width container for sections that need to span entire browser */
  .container-fluid {
    width: 100%;
    padding: 0;
    margin: 0;
  }

  /* Full-width section wrapper */
  .section-full {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    padding: 2rem 0;
  }

  /* Hero section specific styles */
  .hero-section {
    width: 100%;
    min-height: 60vh;
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    margin: 0;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondary};
    }
  }

  .btn-secondary {
    background-color: ${theme.colors.gray};
    color: ${theme.colors.white};
    &:hover:not(:disabled) {
      background-color: ${theme.colors.dark};
    }
  }

  .btn-success {
    background-color: ${theme.colors.success};
    color: ${theme.colors.white};
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }

  .btn-danger {
    background-color: ${theme.colors.danger};
    color: ${theme.colors.white};
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }

  .card {
    background: ${theme.colors.white};
    border-radius: 8px;
    box-shadow: ${theme.shadows.small};
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: box-shadow 0.3s ease;
    &:hover {
      box-shadow: ${theme.shadows.medium};
    }
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
    }
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .w-100 {
    width: 100% !important;
  }

  .h-100 {
    height: 100% !important;
  }

  /* Spacing utilities */
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }
  .mt-5 { margin-top: 3rem; }
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }
  .mb-5 { margin-bottom: 3rem; }

  .p-0 { padding: 0 !important; }
  .px-0 { padding-left: 0 !important; padding-right: 0 !important; }
  .py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }

  /* Responsive adjustments */
  @media (max-width: ${theme.breakpoints.tablet}) {
    .container {
      padding: 0 0.5rem;
    }
    
    .hero-section {
      padding: 2rem 0;
      min-height: 50vh;
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    .container {
      padding: 0 0.25rem;
    }
  }
`;