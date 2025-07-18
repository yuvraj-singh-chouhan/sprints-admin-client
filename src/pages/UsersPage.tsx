import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserRoleStore, User, UserStatus } from '@/lib/userRoleStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Ban, 
  Trash2, 
  Search, 
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
import UserDetailsDialog from '@/components/users/UserDetailsDialog';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatsCard from '@/components/shared/StatsCard';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Calculate aggregate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const suspendedUsers = users.filter(user => user.status === 'suspended').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;

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
    setSelectedUser(user);
    setIsDetailsOpen(true);
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>User Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-admin-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their permissions</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          subtitle="Registered users"
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          subtitle="Currently active"
          icon={<UserCheck className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Suspended Users"
          value={suspendedUsers}
          subtitle="Temporarily suspended"
          icon={<UserX className="h-5 w-5" />}
          color="red"
        />
        <StatsCard
          title="Inactive Users"
          value={inactiveUsers}
          subtitle="Not yet activated"
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
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
          <SelectTrigger className="w-full md:w-[180px]">
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

      {usersStatus === 'loading' ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-muted-foreground">
                          {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Add your first user to get started'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => openUserDetails(user)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.phone}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.department || 'No department'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-admin-primary" />
                          <span className="font-medium">{user.role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(user.status)}
                          className="capitalize"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatLastLogin(user.lastLogin)}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUserDetails(user);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUserEdit(user);
                            }}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleUserStatus(user);
                            }}
                            title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUserDelete(user);
                            }}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

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

      <UserDetailsDialog
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default UsersPage; 