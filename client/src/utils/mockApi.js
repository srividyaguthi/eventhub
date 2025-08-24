// Mock API service that simulates backend responses
const mockUsers = [
    {
      id: 1,
      name: 'Demo Organizer',
      email: 'organizer@demo.com',
      password: 'password123',
      role: 'organizer'
    },
    {
      id: 2,
      name: 'Demo Attendee',
      email: 'attendee@demo.com',
      password: 'password123',
      role: 'attendee'
    },
    {
      id: 3,
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'password123',
      role: 'admin'
    }
  ];
  
  // Simulate network delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const mockApi = {
    login: async (email, password) => {
      await delay(500); // Simulate network delay
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        status: 'success',
        token: `mock-jwt-token-${user.id}`,
        data: {
          user: userWithoutPassword
        }
      };
    },
    
    register: async (name, email, password, role) => {
      await delay(500); // Simulate network delay
      
      // Check if user already exists
      if (mockUsers.find(u => u.email === email)) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        name,
        email,
        password,
        role: role || 'attendee'
      };
      
      mockUsers.push(newUser);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      return {
        status: 'success',
        token: `mock-jwt-token-${newUser.id}`,
        data: {
          user: userWithoutPassword
        }
      };
    },
    
    getCurrentUser: async (token) => {
      await delay(300); // Simulate network delay
      
      if (!token) {
        throw new Error('No token provided');
      }
      
      // Extract user ID from mock token
      const userId = parseInt(token.replace('mock-jwt-token-', ''));
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        status: 'success',
        data: {
          user: userWithoutPassword
        }
      };
    }
  };
  
  export default mockApi;