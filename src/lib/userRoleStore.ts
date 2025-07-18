import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Status = 'idle' | 'loading' | 'success' | 'error';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string; // create, read, update, delete, manage
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  role: Role;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface UserRoleState {
  // Users
  users: User[];
  usersStatus: Status;
  selectedUser: User | null;
  
  // Roles
  roles: Role[];
  rolesStatus: Status;
  selectedRole: Role | null;
  
  // Permissions
  permissions: Permission[];
  permissionsStatus: Status;
  
  // User Actions
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  
  // Role Actions
  fetchRoles: () => Promise<void>;
  createRole: (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<void>;
  updateRole: (roleId: string, roleData: Partial<Role>) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  setSelectedRole: (role: Role | null) => void;
  
  // Permission Actions
  fetchPermissions: () => Promise<void>;
}

// Mock data generators
const generateMockPermissions = (): Permission[] => [
  // Dashboard permissions
  { id: 'perm-001', name: 'View Dashboard', description: 'View dashboard and analytics', module: 'dashboard', action: 'read' },
  { id: 'perm-002', name: 'Manage Dashboard', description: 'Full dashboard management', module: 'dashboard', action: 'manage' },
  
  // Product permissions
  { id: 'perm-003', name: 'View Products', description: 'View product listings', module: 'products', action: 'read' },
  { id: 'perm-004', name: 'Create Products', description: 'Create new products', module: 'products', action: 'create' },
  { id: 'perm-005', name: 'Update Products', description: 'Edit existing products', module: 'products', action: 'update' },
  { id: 'perm-006', name: 'Delete Products', description: 'Delete products', module: 'products', action: 'delete' },
  { id: 'perm-007', name: 'Manage Products', description: 'Full product management', module: 'products', action: 'manage' },
  
  // Order permissions
  { id: 'perm-008', name: 'View Orders', description: 'View order listings', module: 'orders', action: 'read' },
  { id: 'perm-009', name: 'Update Orders', description: 'Update order status', module: 'orders', action: 'update' },
  { id: 'perm-010', name: 'Manage Orders', description: 'Full order management', module: 'orders', action: 'manage' },
  
  // Customer permissions
  { id: 'perm-011', name: 'View Customers', description: 'View customer data', module: 'customers', action: 'read' },
  { id: 'perm-012', name: 'Update Customers', description: 'Edit customer information', module: 'customers', action: 'update' },
  { id: 'perm-013', name: 'Manage Customers', description: 'Full customer management', module: 'customers', action: 'manage' },
  
  // Vendor permissions
  { id: 'perm-014', name: 'View Vendors', description: 'View vendor listings', module: 'vendors', action: 'read' },
  { id: 'perm-015', name: 'Manage Vendors', description: 'Full vendor management', module: 'vendors', action: 'manage' },
  
  // User management permissions
  { id: 'perm-016', name: 'View Users', description: 'View user listings', module: 'users', action: 'read' },
  { id: 'perm-017', name: 'Create Users', description: 'Create new users', module: 'users', action: 'create' },
  { id: 'perm-018', name: 'Update Users', description: 'Edit user information', module: 'users', action: 'update' },
  { id: 'perm-019', name: 'Delete Users', description: 'Delete users', module: 'users', action: 'delete' },
  { id: 'perm-020', name: 'Manage Users', description: 'Full user management', module: 'users', action: 'manage' },
  
  // Role management permissions
  { id: 'perm-021', name: 'View Roles', description: 'View role listings', module: 'roles', action: 'read' },
  { id: 'perm-022', name: 'Create Roles', description: 'Create new roles', module: 'roles', action: 'create' },
  { id: 'perm-023', name: 'Update Roles', description: 'Edit role permissions', module: 'roles', action: 'update' },
  { id: 'perm-024', name: 'Delete Roles', description: 'Delete roles', module: 'roles', action: 'delete' },
  { id: 'perm-025', name: 'Manage Roles', description: 'Full role management', module: 'roles', action: 'manage' },
  
  // Settings permissions
  { id: 'perm-026', name: 'View Settings', description: 'View system settings', module: 'settings', action: 'read' },
  { id: 'perm-027', name: 'Manage Settings', description: 'Full settings management', module: 'settings', action: 'manage' },
];

const generateMockRoles = (permissions: Permission[]): Role[] => [
  {
    id: 'role-001',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: permissions,
    isDefault: false,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'role-002',
    name: 'Admin',
    description: 'Administrative access to most features',
    permissions: permissions.filter(p => 
      !['perm-020', 'perm-025', 'perm-027'].includes(p.id) // No user management, role management, or settings
    ),
    isDefault: false,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'role-003',
    name: 'Manager',
    description: 'Management access to products, orders, and customers',
    permissions: permissions.filter(p => 
      ['dashboard', 'products', 'orders', 'customers', 'vendors'].includes(p.module) &&
      !p.action.includes('delete')
    ),
    isDefault: false,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'role-004',
    name: 'Staff',
    description: 'Basic staff access with read-only permissions',
    permissions: permissions.filter(p => p.action === 'read'),
    isDefault: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'role-005',
    name: 'Customer Support',
    description: 'Customer service representative access',
    permissions: permissions.filter(p => 
      ['customers', 'orders'].includes(p.module) &&
      ['read', 'update'].includes(p.action)
    ),
    isDefault: false,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'system',
  },
];

const generateMockUsers = (roles: Role[]): User[] => [
  {
    id: 'user-001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@shoebox.com',
    phone: '+1-555-123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    status: 'active',
    role: roles[0], // Super Admin
    lastLogin: '2023-10-12T08:30:00Z',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-10-12T08:30:00Z',
    createdBy: 'system',
  },
  {
    id: 'user-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@shoebox.com',
    phone: '+1-555-234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b213?w=32&h=32&fit=crop&crop=face',
    status: 'active',
    role: roles[1], // Admin
    lastLogin: '2023-10-11T14:15:00Z',
    createdAt: '2023-02-20T11:30:00Z',
    updatedAt: '2023-10-11T14:15:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'user-003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@shoebox.com',
    phone: '+1-555-345-6789',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    status: 'active',
    role: roles[2], // Manager
    lastLogin: '2023-10-10T16:45:00Z',
    createdAt: '2023-03-15T09:20:00Z',
    updatedAt: '2023-10-10T16:45:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'user-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@shoebox.com',
    phone: '+1-555-456-7890',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    status: 'active',
    role: roles[4], // Customer Support
    lastLogin: '2023-10-09T13:20:00Z',
    createdAt: '2023-04-10T14:15:00Z',
    updatedAt: '2023-10-09T13:20:00Z',
    createdBy: 'user-002',
  },
  {
    id: 'user-005',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@shoebox.com',
    phone: '+1-555-567-8901',
    status: 'inactive',
    role: roles[3], // Staff
    lastLogin: '2023-09-15T10:30:00Z',
    createdAt: '2023-05-05T16:45:00Z',
    updatedAt: '2023-09-15T10:30:00Z',
    createdBy: 'user-002',
  },
  {
    id: 'user-006',
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa.thompson@shoebox.com',
    phone: '+1-555-678-9012',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    status: 'suspended',
    role: roles[3], // Staff
    lastLogin: '2023-08-20T09:15:00Z',
    createdAt: '2023-06-12T12:00:00Z',
    updatedAt: '2023-08-25T15:30:00Z',
    createdBy: 'user-001',
  },
];

// Create the store
export const useUserRoleStore = create<UserRoleState>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      usersStatus: 'idle',
      selectedUser: null,
      roles: [],
      rolesStatus: 'idle',
      selectedRole: null,
      permissions: [],
      permissionsStatus: 'idle',

      // Permission Actions
      fetchPermissions: async () => {
        set({ permissionsStatus: 'loading' });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const permissions = generateMockPermissions();
          set({ permissions, permissionsStatus: 'success' });
        } catch (error) {
          set({ permissionsStatus: 'error' });
          console.error('Error fetching permissions:', error);
        }
      },

      // Role Actions
      fetchRoles: async () => {
        set({ rolesStatus: 'loading' });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const { permissions } = get();
          const roles = generateMockRoles(permissions);
          set({ roles, rolesStatus: 'success' });
        } catch (error) {
          set({ rolesStatus: 'error' });
          console.error('Error fetching roles:', error);
        }
      },

      createRole: async (roleData) => {
        try {
          const { roles } = get();
          const newRole: Role = {
            ...roleData,
            id: `role-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user', // In real app, get from auth
          };
          set({ roles: [...roles, newRole] });
        } catch (error) {
          console.error('Error creating role:', error);
          throw error;
        }
      },

      updateRole: async (roleId, roleData) => {
        try {
          const { roles } = get();
          const updatedRoles = roles.map(role =>
            role.id === roleId
              ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
              : role
          );
          set({ roles: updatedRoles });
        } catch (error) {
          console.error('Error updating role:', error);
          throw error;
        }
      },

      deleteRole: async (roleId) => {
        try {
          const { roles } = get();
          const role = roles.find(r => r.id === roleId);
          if (role?.isDefault) {
            throw new Error('Cannot delete default role');
          }
          set({ roles: roles.filter(role => role.id !== roleId) });
        } catch (error) {
          console.error('Error deleting role:', error);
          throw error;
        }
      },

      setSelectedRole: (role) => set({ selectedRole: role }),

      // User Actions
      fetchUsers: async () => {
        set({ usersStatus: 'loading' });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          const { roles } = get();
          const users = generateMockUsers(roles);
          set({ users, usersStatus: 'success' });
        } catch (error) {
          set({ usersStatus: 'error' });
          console.error('Error fetching users:', error);
        }
      },

      createUser: async (userData) => {
        try {
          const { users } = get();
          const newUser: User = {
            ...userData,
            id: `user-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user', // In real app, get from auth
          };
          set({ users: [...users, newUser] });
        } catch (error) {
          console.error('Error creating user:', error);
          throw error;
        }
      },

      updateUser: async (userId, userData) => {
        try {
          const { users } = get();
          const updatedUsers = users.map(user =>
            user.id === userId
              ? { ...user, ...userData, updatedAt: new Date().toISOString() }
              : user
          );
          set({ users: updatedUsers });
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
      },

      deleteUser: async (userId) => {
        try {
          const { users } = get();
          set({ users: users.filter(user => user.id !== userId) });
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      setSelectedUser: (user) => set({ selectedUser: user }),
    }),
    {
      name: 'shoebox-user-role-management',
      partialize: (state) => ({
        roles: state.roles,
        permissions: state.permissions,
        users: state.users,
      }),
    }
  )
); 