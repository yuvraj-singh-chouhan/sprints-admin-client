
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  {
    id: '1',
    email: 'admin@shoebox.com',
    password: 'admin123', // In a real app, passwords would be hashed and stored in a backend
    name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'staff@shoebox.com',
    password: 'staff123',
    name: 'Staff User',
    role: 'staff' as const,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (email: string, password: string) => {
        // Mock authentication - in a real app, this would call an API
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            token: 'mock-token-' + Math.random().toString(36).substring(2, 15),
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },
    }),
    {
      name: 'shoebox-auth',
    }
  )
);
