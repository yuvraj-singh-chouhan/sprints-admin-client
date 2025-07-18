
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as UserRoleUser, Permission } from './userRoleStore';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
  // Enhanced user data from userRoleStore
  userRoleData?: UserRoleUser;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Permission checking methods
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccess: (module: string, action: string) => boolean;
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
    (set, get) => ({
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
      
      // Permission checking methods
      hasPermission: (permissionName: string) => {
        const { user } = get();
        if (!user?.userRoleData) return false;
        
        return user.userRoleData.role.permissions.some(
          (permission) => permission.name === permissionName
        );
      },
      
      hasAnyPermission: (permissionNames: string[]) => {
        const { user } = get();
        if (!user?.userRoleData) return false;
        
        return user.userRoleData.role.permissions.some(
          (permission) => permissionNames.includes(permission.name)
        );
      },
      
      hasAllPermissions: (permissionNames: string[]) => {
        const { user } = get();
        if (!user?.userRoleData) return false;
        
        const userPermissionNames = user.userRoleData.role.permissions.map(p => p.name);
        return permissionNames.every(permissionName => 
          userPermissionNames.includes(permissionName)
        );
      },
      
      canAccess: (module: string, action: string) => {
        const { user } = get();
        if (!user?.userRoleData) return false;
        
        return user.userRoleData.role.permissions.some(
          (permission) => permission.module === module && 
                         (permission.action === action || permission.action === 'manage')
        );
      },
    }),
    {
      name: 'shoebox-auth',
    }
  )
);
