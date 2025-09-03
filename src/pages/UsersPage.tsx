import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRoleStore, User, UserStatus } from '@/lib/userRoleStore';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Ban, 
  Trash2, 
  Plus, 
  Shield, 
  User as UserIcon,
  Users,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import UserEditDialog from '@/components/users/UserEditDialog';
import UserDeleteDialog from '@/components/users/UserDeleteDialog';
import UserCreateDialog from '@/components/users/UserCreateDialog';

import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import AvatarWithInitials from '@/components/shared/AvatarWithInitials';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatsGrid from '@/components/shared/StatsGrid';
import StatusBadge from '@/components/shared/StatusBadge';


const UsersPage = () => {
  const { 
    users, 
    usersStatus, 
    roles,
    fetchUsers, 
    fetchRoles,
    fetchPermissions,
    updateUser,
    selectedUser,
    setSelectedUser
  } = useUserRoleStore();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);


  // Items per page
  const itemsPerPage = 10;

  useEffect(() => {
    const initializeData = async () => {
      await fetchPermissions();
      await fetchRoles();
      await fetchUsers();
    };
    initializeData();
  }, [fetchUsers, fetchRoles, fetchPermissions]);

  // Filter users based on search term, status, and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;

    const matchesRole = 
      roleFilter === 'all' || 
      user.role.id === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate aggregate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const suspendedUsers = users.filter(user => user.status === 'suspended').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;

  // Prepare stats data
  const statsData = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Users className="h-5 w-5" />,
      color: "blue" as const,
      subtitle: "All users"
    },
    {
      title: "Active Users", 
      value: activeUsers,
      icon: <UserCheck className="h-5 w-5" />,
      color: "green" as const,
      subtitle: "Currently active"
    },
    {
      title: "Suspended Users",
      value: suspendedUsers,
      icon: <UserX className="h-5 w-5" />,
      color: "red" as const,
      subtitle: "Suspended accounts"
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: <Clock className="h-5 w-5" />,
      color: "amber" as const,
      subtitle: "Inactive accounts"
    }
  ];

  // Prepare table columns
  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <AvatarWithInitials 
            name={`${user.firstName} ${user.lastName}`} 
            size="lg" 
          />
          <div>
            <div className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-admin-primary" />
          <div>
            <div className="font-medium text-gray-900">{user.role.name}</div>
            <div className="text-sm text-muted-foreground">
              {user.role.permissions.length} permissions
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (user: User) => (
        <div className="text-sm">
          {user.phone || 'No phone'}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => <StatusBadge status={user.status} />
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user: User) => (
        <div className="text-sm text-muted-foreground">
          {formatLastLogin(user.lastLogin)}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openUserDetails(user)}
            className="h-8 w-8 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-slate-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openUserEdit(user)}
            className="h-8 w-8 hover:bg-blue-50"
            title="Edit User"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleUserStatus(user)}
            className={`h-8 w-8 ${
              user.status === 'active' 
                ? 'hover:bg-amber-50' 
                : 'hover:bg-green-50'
            }`}
            title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
          >
            <Ban className={`h-4 w-4 ${
              user.status === 'active' 
                ? 'text-amber-600' 
                : 'text-green-600'
            }`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openUserDelete(user)}
            className="h-8 w-8 hover:bg-red-50"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  const toggleUserStatus = async (user: User) => {
    try {
      let newStatus: UserStatus;
      switch (user.status) {
        case 'active':
          newStatus = 'suspended';
          break;
        case 'suspended':
          newStatus = 'active';
          break;
        case 'inactive':
          newStatus = 'active';
          break;
        default:
          newStatus = 'active';
      }
      
      await updateUser(user.id, { status: newStatus });
      toast.success(`User ${user.firstName} ${user.lastName} ${newStatus === 'active' ? 'activated' : newStatus} successfully!`);
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never';
    return new Date(lastLogin).toLocaleDateString();
  };

  const openUserDetails = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const openUserEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openUserDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="User Management"
        description="Manage system users and their permissions"
        icon={<Users className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "User Management" }
        ]}
        action={{
          label: "Add User",
          onClick: () => setIsCreateOpen(true),
          icon: <Plus className="h-4 w-4" />
        }}
      />

      <StatsGrid stats={statsData} />

      <DataTable
        data={filteredUsers}
        columns={columns}
        searchPlaceholder="Search users..."
        filters={
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        emptyState={{
          icon: <Users className="h-12 w-12" />,
          title: "No users found",
          description: searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
            ? 'Try adjusting your search or filters'
            : 'Add your first user to get started'
        }}
        onRowClick={(user) => openUserDetails(user)}
        loading={usersStatus === 'loading'}
        itemsPerPage={itemsPerPage}
      />

      {/* User dialogs */}
      <UserCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <UserEditDialog
        user={selectedUser}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <UserDeleteDialog
        user={selectedUser}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
};

export default UsersPage;