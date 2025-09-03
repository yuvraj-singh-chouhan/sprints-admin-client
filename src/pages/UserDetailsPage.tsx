import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRoleStore, User } from '@/lib/userRoleStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Edit, 
  Ban, 
  Trash2, 
  Shield,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Clock,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import AvatarWithInitials from '@/components/shared/AvatarWithInitials';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import UserEditDialog from '@/components/users/UserEditDialog';
import UserDeleteDialog from '@/components/users/UserDeleteDialog';
import { formatDateTime } from '@/lib/utils';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { 
    users, 
    updateUser,
    selectedUser,
    setSelectedUser,
    usersStatus,
    fetchUsers 
  } = useUserRoleStore();
  
  const [user, setUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (usersStatus === 'idle') {
      fetchUsers();
    }
  }, [usersStatus, fetchUsers]);

  useEffect(() => {
    if (users.length > 0 && userId) {
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setSelectedUser(foundUser);
      } else {
        toast.error('User not found');
        navigate('/users');
      }
    }
  }, [users, userId, navigate, setSelectedUser]);

  const toggleUserStatus = async () => {
    if (!user) return;
    
    try {
      let newStatus: 'active' | 'suspended' | 'inactive';
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
      setUser({ ...user, status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : newStatus} successfully!`);
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const openEdit = () => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const openDelete = () => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never logged in';
    return formatDateTime(lastLogin);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suspended':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description="User profile and management"
        icon={<UserIcon className="h-8 w-8" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "User Management", href: "/users" },
          { label: `${user.firstName} ${user.lastName}` }
        ]}
        action={{
          label: "Back to Users",
          onClick: () => navigate('/users'),
          icon: <ArrowLeft className="h-4 w-4" />
        }}
      />

      <div className="p-6 space-y-8 animate-in fade-in duration-700">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="relative">
              <AvatarWithInitials 
                name={`${user.firstName} ${user.lastName}`}
                size="2xl"
                className="ring-4 ring-white/20 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg">
                {getStatusIcon(user.status)}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.firstName} {user.lastName}</h1>
              <p className="text-white/80 text-lg mb-3">{user.email}</p>
              <div className="flex items-center gap-4">
                <StatusBadge status={user.status} />
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {user.role.name}
                </Badge>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-3 min-w-[200px]">
              <Button 
                onClick={openEdit}
                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm transition-all duration-200"
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button 
                onClick={toggleUserStatus}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all duration-200"
                variant="outline"
              >
                <Ban className="h-4 w-4 mr-2" />
                {user.status === 'active' ? 'Suspend' : 'Activate'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact Information Card */}
          <Card className="lg:col-span-1 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <UserIcon className="h-5 w-5 text-slate-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600">Email Address</p>
                    <p className="text-slate-800 font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600">Phone Number</p>
                    <p className="text-slate-800 font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all duration-200">
                  <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600">Last Login</p>
                    <p className="text-slate-800 font-medium">{formatLastLogin(user.lastLogin)}</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600">Member Since</p>
                    <p className="text-slate-800 font-medium">{formatDateTime(user.createdAt)}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Mobile Action Buttons */}
              <div className="md:hidden space-y-3">
                <Button 
                  onClick={openEdit}
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200" 
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                
                <Button 
                  onClick={toggleUserStatus}
                  className={`w-full justify-start ${
                    user.status === 'active' 
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' 
                      : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                  }`}
                  variant="outline"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                </Button>
                
                <Button 
                  onClick={openDelete}
                  className="w-full justify-start bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Shield className="h-5 w-5 text-slate-600" />
                  Role & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{user.role.name}</h3>
                        <p className="text-white/80">{user.role.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                      {user.role.permissions.length} permissions
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4 text-slate-800">Assigned Permissions</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {user.role.permissions.map((permission, index) => (
                      <div
                        key={permission.id}
                        className="group flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-700">{permission.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity & Stats */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Settings className="h-5 w-5 text-slate-600" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="group text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-bold mb-2">
                      {user.role.permissions.length}
                    </div>
                    <div className="text-blue-100 font-medium">Total Permissions</div>
                  </div>
                  
                  <div className="group text-center p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-bold mb-2">
                      {user.status === 'active' ? '✓' : '✗'}
                    </div>
                    <div className="text-emerald-100 font-medium">Account Status</div>
                  </div>
                  
                  <div className="group text-center p-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-bold mb-2">
                      {user.lastLogin ? '✓' : '✗'}
                    </div>
                    <div className="text-purple-100 font-medium">Login Activity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <UserEditDialog
        user={selectedUser}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <UserDeleteDialog
        user={selectedUser}
        open={isDeleteOpen}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            // If user was deleted, navigate back to users list
            navigate('/users');
          }
        }}
      />
    </div>
  );
};

export default UserDetailsPage; 