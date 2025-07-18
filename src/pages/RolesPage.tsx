import { useEffect, useState } from 'react';
import { useUserRoleStore, Role } from '@/lib/userRoleStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Shield, 
  Users,
  Settings,
  Lock,
  Crown
} from 'lucide-react';
import RoleEditDialog from '@/components/roles/RoleEditDialog';
import RoleDeleteDialog from '@/components/roles/RoleDeleteDialog';
import RoleCreateDialog from '@/components/roles/RoleCreateDialog';
import RoleDetailsDialog from '@/components/roles/RoleDetailsDialog';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatsCard from '@/components/shared/StatsCard';

const RolesPage = () => {
  const { 
    roles, 
    rolesStatus, 
    users,
    fetchRoles, 
    fetchUsers,
    fetchPermissions,
    selectedRole,
    setSelectedRole
  } = useUserRoleStore();
  
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [fetchRoles, fetchUsers, fetchPermissions]);

  // Filter roles based on search term
  const filteredRoles = roles.filter(role => {
    const matchesSearch = 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  // Calculate aggregate stats
  const totalRoles = roles.length;
  const defaultRoles = roles.filter(role => role.isDefault).length;
  const customRoles = roles.filter(role => !role.isDefault).length;
  const totalPermissions = roles.reduce((sum, role) => sum + role.permissions.length, 0);

  const getUserCountForRole = (roleId: string) => {
    return users.filter(user => user.role.id === roleId).length;
  };

  const openRoleDetails = (role: Role) => {
    setSelectedRole(role);
    setIsDetailsOpen(true);
  };

  const openRoleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditOpen(true);
  };

  const openRoleDelete = (role: Role) => {
    if (role.isDefault) {
      toast.error('Cannot delete default role');
      return;
    }
    
    const userCount = getUserCountForRole(role.id);
    if (userCount > 0) {
      toast.error(`Cannot delete role. ${userCount} user(s) are assigned to this role.`);
      return;
    }
    
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            <BreadcrumbPage>Role Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-admin-primary/5 to-admin-primary/10 rounded-lg border">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-admin-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="text-muted-foreground">Define roles and manage user permissions</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Roles"
          value={totalRoles}
          subtitle="Defined roles"
          icon={<Shield className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Default Roles"
          value={defaultRoles}
          subtitle="System roles"
          icon={<Crown className="h-5 w-5" />}
          color="purple"
        />
        <StatsCard
          title="Custom Roles"
          value={customRoles}
          subtitle="Organization roles"
          icon={<Settings className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Total Permissions"
          value={totalPermissions}
          subtitle="Across all roles"
          icon={<Lock className="h-5 w-5" />}
          color="amber"
        />
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {rolesStatus === 'loading' ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading roles...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Roles Table */}
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">No roles found</p>
                        <p className="text-muted-foreground">
                          {searchTerm 
                            ? 'Try adjusting your search'
                            : 'Create your first role to get started'
                          }
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRoles.map((role) => {
                    const userCount = getUserCountForRole(role.id);
                    return (
                      <TableRow 
                        key={role.id} 
                        className="hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => openRoleDetails(role)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold">
                                {getInitials(role.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 flex items-center gap-2">
                                {role.name}
                                {role.isDefault && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              {role.isDefault && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  System Role
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {role.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline" className="font-mono">
                              {userCount}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">
                            {role.permissions.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={role.isDefault ? "secondary" : "default"}
                            className="capitalize"
                          >
                            {role.isDefault ? 'System' : 'Custom'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                openRoleDetails(role);
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
                                openRoleEdit(role);
                              }}
                              title="Edit Role"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!role.isDefault && userCount === 0 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRoleDelete(role);
                                }}
                                title="Delete Role"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* Role dialogs */}
      <RoleCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <RoleEditDialog
        role={selectedRole}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <RoleDeleteDialog
        role={selectedRole}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />

      <RoleDetailsDialog
        role={selectedRole}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default RolesPage; 